import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User , Doctor]),
    AuthModule,                      
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
