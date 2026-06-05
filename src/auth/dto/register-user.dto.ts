import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterUserDto {

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;
}