import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async findByEmail(email: string) {
    return this.doctorRepository.findOne({
      where: { email },
    });
  }

  async create(doctorData: Partial<Doctor>) {
    const doctor =
      this.doctorRepository.create(doctorData);

    return this.doctorRepository.save(doctor);
  }
}