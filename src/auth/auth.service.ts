import {
  Injectable,
  ConflictException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { DoctorsService } from '../doctors/doctors.service';
import { RegisterDoctorDto } from './dto/register-doctor.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly doctorsService: DoctorsService,
  ) {}

  async registerDoctor(
    registerDoctorDto: RegisterDoctorDto,
  ) {
    const existingDoctor =
      await this.doctorsService.findByEmail(
        registerDoctorDto.email,
      );

    if (existingDoctor) {
      throw new ConflictException(
        'Doctor already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        registerDoctorDto.password,
        10,
      );

    const doctor =
      await this.doctorsService.create({
        name: registerDoctorDto.name,
        email: registerDoctorDto.email,
        specialization:
          registerDoctorDto.specialization,
        password_hash: hashedPassword,
      });

    return {
      message:
        'Doctor registered successfully',
      doctorId: doctor.id,
    };
  }
}