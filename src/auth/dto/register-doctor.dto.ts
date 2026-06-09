import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDoctorDto {

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  specialization: string;

  @IsString()
  @MinLength(6)
  password: string;
}