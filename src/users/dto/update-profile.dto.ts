import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsDateString()
  date_of_birth: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  emergency_contact_name: string;

  @IsOptional()
  @IsString()
  emergency_contact_phone: string;

  @IsOptional()
  @IsString()
  blood_group: string;

  @IsOptional()
  @IsString()
  allergies: string;

  @IsOptional()
  @IsString()
  medical_note: string;
}