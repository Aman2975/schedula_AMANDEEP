import { IsEnum, IsString, IsOptional, IsBoolean, Matches } from 'class-validator';
import { DayOfWeek } from '../entities/recurring-availability.entity';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class UpdateRecurringDto {

  @IsOptional()
  @IsEnum(DayOfWeek)
  day_of_week: DayOfWeek;

  @IsOptional()
  @IsString()
  @Matches(TIME_REGEX, { message: 'start_time must be in HH:MM format' })
  start_time: string;

  @IsOptional()
  @IsString()
  @Matches(TIME_REGEX, { message: 'end_time must be in HH:MM format' })
  end_time: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}