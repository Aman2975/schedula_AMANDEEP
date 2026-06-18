import { IsString, IsOptional, IsEnum, Matches, IsDateString } from 'class-validator';
import { CustomAvailabilityStatus } from '../entities/custom-availability.entity';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateOverrideDto {

  @IsDateString()
  date: string;                     // ← YYYY-MM-DD format

  @IsOptional()
  @IsString()
  @Matches(TIME_REGEX, { message: 'start_time must be in HH:MM format' })
  start_time: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_REGEX, { message: 'end_time must be in HH:MM format' })
  end_time: string;

  @IsOptional()
  @IsEnum(CustomAvailabilityStatus)
  status: CustomAvailabilityStatus;

  @IsOptional()
  @IsString()
  reason: string;
}