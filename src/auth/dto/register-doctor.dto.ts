import {
  IsString,
  IsEmail,
  MinLength,
} from 'class-validator';

export class RegisterDoctorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  specialization: string;

  @MinLength(6)
  password: string;
}