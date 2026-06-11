import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecurringAvailability } from './entities/recurring-availability.entity';
import { CustomAvailability, CustomAvailabilityStatus } from './entities/custom-availability.entity';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { CreateOverrideDto } from './dto/create-override.dto';

@Injectable()
export class AvailabilityService {

  constructor(
    @InjectRepository(RecurringAvailability)
    private recurringRepo: Repository<RecurringAvailability>,

    @InjectRepository(CustomAvailability)
    private customRepo: Repository<CustomAvailability>,
  ) {}

  // ─── Helper: Check Time Valid ─────────────────
  private isValidTimeRange(start: string, end: string): boolean {
    return start < end;              // ← "10:00" < "12:00" = true
  }

  // ─── Helper: Check Overlap ────────────────────
  private hasOverlap(
    existingStart: string,
    existingEnd: string,
    newStart: string,
    newEnd: string,
  ): boolean {
    return newStart < existingEnd && newEnd > existingStart;
  }

  // ─── POST /doctor/availability ────────────────
  async createRecurring(doctorId: number, dto: CreateRecurringDto) {

    // validate time range
    if (!this.isValidTimeRange(dto.start_time, dto.end_time)) {
      throw new BadRequestException('end_time must be after start_time');
    }

    // check for overlapping slots on same day
    const existing = await this.recurringRepo.find({
      where: {
        doctor_id: doctorId,
        day_of_week: dto.day_of_week,
        is_active: true,
      }
    });

    for (const slot of existing) {
      if (this.hasOverlap(slot.start_time, slot.end_time, dto.start_time, dto.end_time)) {
        throw new BadRequestException(
          `Time slot overlaps with existing slot ${slot.start_time} - ${slot.end_time} on ${slot.day_of_week}`
        );
      }
    }

    // check duplicate
    const duplicate = existing.find(
      slot => slot.start_time === dto.start_time && slot.end_time === dto.end_time
    );
    if (duplicate) {
      throw new BadRequestException('This availability slot already exists');
    }

    const availability = this.recurringRepo.create({
      doctor_id: doctorId,
      ...dto,
    });

    await this.recurringRepo.save(availability);
    return { message: 'Recurring availability created successfully', data: availability };
  }

  // ─── GET /doctor/availability ─────────────────
  async getRecurring(doctorId: number) {
    const availability = await this.recurringRepo.find({
      where: { doctor_id: doctorId, is_active: true },
      order: { day_of_week: 'ASC', start_time: 'ASC' },
    });

    // group by day
    const grouped = availability.reduce((acc, slot) => {
      if (!acc[slot.day_of_week]) acc[slot.day_of_week] = [];
      acc[slot.day_of_week].push({
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
      });
      return acc;
    }, {});

    return grouped;
  }

  // ─── PATCH /doctor/availability/:id ──────────
  async updateRecurring(doctorId: number, id: number, dto: UpdateRecurringDto) {

    const slot = await this.recurringRepo.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('Availability slot not found');

    // make sure doctor owns this slot
    if (slot.doctor_id !== doctorId) {
      throw new ForbiddenException('You can only update your own availability');
    }

    // validate time if provided
    const newStart = dto.start_time || slot.start_time;
    const newEnd = dto.end_time || slot.end_time;

    if (!this.isValidTimeRange(newStart, newEnd)) {
      throw new BadRequestException('end_time must be after start_time');
    }

    // check overlap with other slots (exclude current slot)
    const day = dto.day_of_week || slot.day_of_week;
    const others = await this.recurringRepo.find({
      where: { doctor_id: doctorId, day_of_week: day, is_active: true },
    });

    for (const other of others) {
      if (other.id === id) continue;    // ← skip current slot
      if (this.hasOverlap(other.start_time, other.end_time, newStart, newEnd)) {
        throw new BadRequestException(
          `Time slot overlaps with existing slot ${other.start_time} - ${other.end_time}`
        );
      }
    }

    await this.recurringRepo.update(id, dto);
    return { message: 'Availability updated successfully' };
  }

  // ─── DELETE /doctor/availability/:id ─────────
  async deleteRecurring(doctorId: number, id: number) {

    const slot = await this.recurringRepo.findOne({ where: { id } });
    if (!slot) throw new NotFoundException('Availability slot not found');

    if (slot.doctor_id !== doctorId) {
      throw new ForbiddenException('You can only delete your own availability');
    }

    await this.recurringRepo.update(id, { is_active: false }); // ← soft delete
    return { message: 'Availability deleted successfully' };
  }

  // ─── POST /doctor/availability/override ──────
  async createOverride(doctorId: number, dto: CreateOverrideDto) {

    // validate date is not in past
    const today = new Date().toISOString().split('T')[0];
    if (dto.date < today) {
      throw new BadRequestException('Cannot set availability for past dates');
    }

    // if available status, time is required
    if (dto.status === CustomAvailabilityStatus.AVAILABLE || !dto.status) {
      if (!dto.start_time || !dto.end_time) {
        throw new BadRequestException('start_time and end_time are required for available status');
      }
      if (!this.isValidTimeRange(dto.start_time, dto.end_time)) {
        throw new BadRequestException('end_time must be after start_time');
      }
    }

    // check duplicate override for same date and time
    const existing = await this.customRepo.find({
      where: { doctor_id: doctorId, date: dto.date }
    });

    for (const slot of existing) {
      if (slot.start_time && dto.start_time) {
        if (this.hasOverlap(slot.start_time, slot.end_time, dto.start_time, dto.end_time)) {
          throw new BadRequestException(
            `Override overlaps with existing slot ${slot.start_time} - ${slot.end_time} on ${dto.date}`
          );
        }
      }
    }

    const override = this.customRepo.create({
      doctor_id: doctorId,
      ...dto,
    });

    await this.customRepo.save(override);
    return { message: 'Override created successfully', data: override };
  }

  // ─── GET /doctor/availability/date ───────────
  async getByDate(doctorId: number, date: string) {

    // validate date format
    if (!date) throw new BadRequestException('date query param is required');

    // get day of week from date
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = dayNames[new Date(date).getDay()];

    // check custom override first
    const customSlots = await this.customRepo.find({
      where: { doctor_id: doctorId, date }
    });

    if (customSlots.length > 0) {
      return {
        date,
        type: 'custom_override',    // ← tells frontend this is an override
        slots: customSlots.map(slot => ({
          id: slot.id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          status: slot.status,
          reason: slot.reason,
        }))
      };
    }

    // fall back to recurring availability
    const recurringSlots = await this.recurringRepo.find({
      where: {
        doctor_id: doctorId,
        day_of_week: dayOfWeek as any,
        is_active: true,
      },
      order: { start_time: 'ASC' }
    });

    return {
      date,
      day_of_week: dayOfWeek,
      type: 'recurring',            // ← tells frontend this is recurring
      slots: recurringSlots.map(slot => ({
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
      }))
    };
  }
}