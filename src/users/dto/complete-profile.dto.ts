import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CompleteUserProfileDto {

  @IsString()
  gender: string;

  @IsDateString()
  date_of_birth: string;

  @IsString()
  address: string;

  @IsString()
  emergency_contact_name: string;

  @IsString()
  emergency_contact_phone: string;

  @IsString()
  blood_group: string;

  @IsOptional()
  @IsString()
  allergies: string;

  @IsOptional()
  @IsString()
  medical_note: string;
}