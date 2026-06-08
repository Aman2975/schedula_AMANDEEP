import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDoctorDto {

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  experience_years: number;

  @IsOptional()
  @IsString()
  qualification: string;

  @IsOptional()
  @IsNumber()
  consultation_fee: number;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  clinic_name: string;

  @IsOptional()
  @IsString()
  clinic_address: string;
}