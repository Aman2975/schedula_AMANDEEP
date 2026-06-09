import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , ILike, Between } from 'typeorm';
import { User } from './entities/user.entity';
import { CompleteUserProfileDto } from './dto/complete-profile.dto';
import { UpdateUserDto } from './dto/update-profile.dto';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { QueryDoctorDto } from './dto/query-doctor.dto';
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

  ) {}

  // ─── GET /user/profile ────────────────────────
  async getProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (!user) throw new NotFoundException('User not found');

    const { password_hash, ...result } = user; // ← never return password
    return result;
  }

  // ─── POST /user/profile ───────────────────────
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

  // ─── PATCH /user/profile ──────────────────────
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

}