import { Injectable, UnauthorizedException, ConflictException, Logger , NotFoundException, BadRequestException} from '@nestjs/common'
import { UpdateDoctorDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Doctor } from './entities/doctor.entity';
import { CompleteProfileDto } from './dto/profile-complition.dto';

@Injectable()
export class DoctorsService {

  constructor(
        @InjectRepository(Doctor)
        private doctorRepository: Repository<Doctor>
  ){}

  
async getDoctorProfile(doctorId: number) {
      const doctor = await this.doctorRepository.findOne({
        where: { id: doctorId }
      });
      if (!doctor) throw new UnauthorizedException('Doctor not found');
  
      const { password_hash, ...result } = doctor; 
      return result;
    }

  async completeDoctorProfile(doctorId: number,dto:CompleteProfileDto) {
    // return {data:dto};
    // console.log(doctorId)
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId }
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    // check if profile already completed
    if (doctor.is_profile_completed) {
      throw new BadRequestException('Profile already completed. Use PATCH to update.');
    }

    await this.doctorRepository.update(doctorId, {
      ...dto,
      is_profile_completed: true,
    });

    return { message: 'Profile completed successfully' };
  }

 
  async updateProfile(doctorId: number, dto: UpdateDoctorDto) {
    const doctor = await this.doctorRepository.findOne({
      where: { id:doctorId }
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    await this.doctorRepository.update(doctorId, dto);

    return { message: 'Profile updated successfully' };
  }
  
}
