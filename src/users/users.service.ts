import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , ILike, Between } from 'typeorm';
import { User } from './entities/user.entity';
import { CompleteUserProfileDto } from './dto/complete-profile.dto';
import { UpdateUserDto } from './dto/update-profile.dto';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { QueryDoctorDto } from './dto/query-doctor.dto';
import { RecurringAvailability } from 'src/avaliability/entities/recurring-availability.entity';
import { CustomAvailability, CustomAvailabilityStatus } from 'src/avaliability/entities/custom-availability.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(RecurringAvailability)
  private recurringRepo: Repository<RecurringAvailability>,

  @InjectRepository(CustomAvailability)
  private customRepo: Repository<CustomAvailability>,

  @InjectRepository(Appointment)
  private appointmentRepo: Repository<Appointment>,

  ) {}

  private generateSlots(
  start: string,
  end: string,
  durationMinutes: number
): { start: string; end: string }[] {

  const slots: { start: string; end: string }[] = []; // ← fix here

  const toMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const toTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  let current = toMinutes(start);
  const endMinutes = toMinutes(end);

  while (current + durationMinutes <= endMinutes) {
    slots.push({
      start: toTime(current),
      end: toTime(current + durationMinutes),
    });
    current += durationMinutes;
  }

  return slots;
}


  async getProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (!user) throw new NotFoundException('User not found');

    const { password_hash, ...result } = user; // ← never return password
    return result;
  }


  async completeProfile(id: number, dto: CompleteUserProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.is_profile_completed) {
      throw new BadRequestException('Profile already completed. Use PATCH to update.');
    }

    await this.userRepository.update(id, {
      ...dto,
      is_profile_completed: true,   // ← mark as completed
    });

    return { message: 'Profile completed successfully' };
  }


  async updateProfile(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.update(id, dto);

    return { message: 'Profile updated successfully' };
  }

  async searchDoctors(query: QueryDoctorDto) {
  const {
    search,
    specialization,
    clinic_name,
    gender,
    min_fee,
    max_fee,
    page = 1,
    limit = 10,
  } = query;

  const where: any = {};

  if (specialization) {
    where.specialization = ILike(`%${specialization}%`); // ← case insensitive
  }

  if (clinic_name) {
    where.clinic_name = ILike(`%${clinic_name}%`);
  }

  if (gender) {
    where.gender = gender;
  }

  if (min_fee && max_fee) {
    where.consultation_fee = Between(min_fee, max_fee);
  }

  let doctors: Doctor[];
  let total: number;

  if (search) {
    
    [doctors, total] = await this.doctorRepository.findAndCount({
      where: [
        { name: ILike(`%${search}%`), ...where },
        { email: ILike(`%${search}%`), ...where },
        { clinic_name: ILike(`%${search}%`), ...where },
        { specialization: ILike(`%${search}%`), ...where },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });
  } else {
    [doctors, total] = await this.doctorRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  
  const result = doctors.map(({ password_hash, ...doctor }) => doctor);

  return {
    data: result,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}


async getDoctorById(id: number) {
  const doctor = await this.doctorRepository.findOne({
    where: { id }
  });
  if (!doctor) throw new NotFoundException('Doctor not found');

  const { password_hash, ...result } = doctor;
  return result;
}





async getDoctorSlots(doctorId: number, date: string) {

  // validate date
  if (!date) throw new BadRequestException('date is required');

  const today = new Date().toISOString().split('T')[0];
  if (date < today) throw new BadRequestException('Cannot check past dates');


  const doctor = await this.doctorRepository.findOne({
    where: { id: doctorId }
  });
  if (!doctor) throw new NotFoundException('Doctor not found');

  const duration = doctor.slot_duration_minutes || 30; // ← default 30 mins


  let windows: { start_time: string; end_time: string }[] = [];

  const customSlots = await this.customRepo.find({
    where: { doctor_id: doctorId, date }
  });

  if (customSlots.length > 0) {
  
    const unavailable = customSlots.find(
      s => s.status === CustomAvailabilityStatus.UNAVAILABLE
    );
    if (unavailable) {
      return {
        doctor: {
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          slot_duration_minutes: duration,
        },
        date,
        available: false,
        reason: unavailable.reason || 'Doctor not available on this date',
        slots: [],
      };
    }
   
    windows = customSlots.map(s => ({
      start_time: s.start_time,
      end_time: s.end_time,
    }));

  } else {
    // fall back to recurring
    const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const dayOfWeek = dayNames[new Date(date).getDay()];

    const recurring = await this.recurringRepo.find({
      where: {
        doctor_id: doctorId,
        day_of_week: dayOfWeek as any,
        is_active: true,
      }
    });

    if (recurring.length === 0) {
      return {
        doctor: {
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specialization,
          slot_duration_minutes: duration,
        },
        date,
        available: false,
        reason: 'Doctor has no availability on this day',
        slots: [],
      };
    }

    windows = recurring.map(r => ({
      start_time: r.start_time,
      end_time: r.end_time,
    }));
  }

 
  let allSlots: { start: string; end: string }[] = [];

  for (const window of windows) {
    const slots = this.generateSlots(
      window.start_time,
      window.end_time,
      duration
    );
    allSlots = [...allSlots, ...slots];
  }

  // ─── Step 3: Check booked slots ──────────────
  const bookedAppointments = await this.appointmentRepo
    .createQueryBuilder('appointment')
    .where('appointment.doctor_id = :doctorId', { doctorId })
    .andWhere('DATE(appointment.appointment_time) = :date', { date })
    .andWhere('appointment.status != :status', { status: 'cancelled' })
    .getMany();

  // ─── Step 4: Mark each slot ───────────────────
  const finalSlots = allSlots.map(slot => {
    const isBooked = bookedAppointments.some(appt => {
      const apptTime = new Date(appt.appointment_time)
        .toTimeString()
        .slice(0, 5);          // ← extract HH:MM from timestamp
      return apptTime === slot.start;
    });

    return {
      start: slot.start,
      end: slot.end,
      status: isBooked ? 'booked' : 'available',
    };
  });

  // ─── Step 5: Return response ──────────────────
  return {
    doctor: {
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      consultation_fee: doctor.consultation_fee,
      slot_duration_minutes: duration,
    },
    date,
    available: true,
    total_slots: finalSlots.length,
    available_slots: finalSlots.filter(s => s.status === 'available').length,
    booked_slots: finalSlots.filter(s => s.status === 'booked').length,
    slots: finalSlots,
  };
}

}