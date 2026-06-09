import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CompleteProfileDto {

  @IsNumber()
  experience_years: number;

  @IsString()
  qualification: string;

  @IsNumber()
  consultation_fee: number;

  @IsString()
  phone: string;

  @IsString()
  gender: string;

  @IsString()
  bio: string;

  @IsString()
  clinic_name: string;

  @IsString()
  clinic_address: string;
}