import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { LoginDto } from './dto/login.dto';
import { profile } from 'console';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    private jwtService: JwtService,
  ) {}

  
  async registerUser(dto: RegisterUserDto) {
    const exists = await this.userRepository.findOne({
      where: { email: dto.email }
    });
    if (exists) throw new ConflictException('Email already exists');

    const password_hash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password_hash,
    });
    await this.userRepository.save(user);

    return { message: 'User registered successfully' };
  }

  
  async registerDoctor(dto: RegisterDoctorDto) {
    const exists = await this.doctorRepository.findOne({
      where: { email: dto.email }
    });
    if (exists) throw new ConflictException('Email already exists');

    const password_hash = await bcrypt.hash(dto.password, 10);

    const doctor = this.doctorRepository.create({
      name: dto.name,
      email: dto.email,
      specialization: dto.specialization,
      password_hash,
    });
    await this.doctorRepository.save(doctor);

    return { message: 'Doctor registered successfully' };
  }

  
  async login(dto: LoginDto) {

    

    if (dto.role === 'user') {
   
      const user = await this.userRepository.findOne({
        where: { email: dto.email }
      });

      
      if (!user) throw new UnauthorizedException('Invalid credentials');
      
      const isMatch = await bcrypt.compare(dto.password, user.password_hash);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
      
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: 'user',               
      });
      
      return { token, role: 'user',profile_completed:user.is_profile_completed };
      
    } else {
      
      const doctor = await this.doctorRepository.findOne({
        where: { email: dto.email }
      });

      // console.log(doctor)

      if (!doctor) throw new UnauthorizedException('Invalid credentials');

      const isMatch = await bcrypt.compare(dto.password, doctor.password_hash);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      const token = this.jwtService.sign({
        sub: doctor.id,
        email: doctor.email,
        role: 'doctor',

      });

      return { token, role: 'doctor', profile_completed:doctor.is_profile_completed };
    }
  }

  
  // async getUserProfile(userId: number) {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId }
  //   });
  //   if (!user) throw new UnauthorizedException('User not found');

  //   const { password_hash, ...result } = user; 
  //   return result;
  // }

 
  // async getDoctorProfile(doctorId: number) {
  //   const doctor = await this.doctorRepository.findOne({
  //     where: { id: doctorId }
  //   });
  //   if (!doctor) throw new UnauthorizedException('Doctor not found');

  //   const { password_hash, ...result } = doctor; 
  //   return result;
  // }
}