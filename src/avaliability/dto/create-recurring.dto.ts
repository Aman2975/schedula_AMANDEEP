import { IsEnum, IsString, Matches } from 'class-validator';
import { DayOfWeek } from '../entities/recurring-availability.entity';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format

export class CreateRecurringDto {

  @IsEnum(DayOfWeek)
  day_of_week: DayOfWeek;

  @IsString()
  @Matches(TIME_REGEX, { message: 'start_time must be in HH:MM format' })
  start_time: string;

  @IsString()
  @Matches(TIME_REGEX, { message: 'end_time must be in HH:MM format' })
  end_time: string;
}