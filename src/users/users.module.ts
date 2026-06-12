import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { RecurringAvailability } from 'src/avaliability/entities/recurring-availability.entity';
import { CustomAvailability } from 'src/avaliability/entities/custom-availability.entity';
import { AvailabilityModule } from 'src/avaliability/avaliability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,
       Doctor,
      RecurringAvailability,
  CustomAvailability,
  Appointment,  

      ]),
    AuthModule, 
    AvailabilityModule,                     
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
