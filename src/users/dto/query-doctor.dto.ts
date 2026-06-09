import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDoctorDto {

  @IsOptional()
  @IsString()
  search: string;             // ← searches name, email

  @IsOptional()
  @IsString()
  specialization: string;

  @IsOptional()
  @IsString()
  clinic_name: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  blood_group: string;        

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  min_fee: number;            // ← filter by min consultation fee

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  max_fee: number;            // ← filter by max consultation fee

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;           // ← default page 1

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;         // ← default 10 per page
}