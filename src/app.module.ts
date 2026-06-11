import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { UsersModule } from './users/users.module';
import { AvailabilityModule } from './avaliability/avaliability.module';
@Module({
  imports: [    
    ConfigModule.forRoot({
    isGlobal: true,
    }),

    DatabaseModule,
    AuthModule,
    DoctorsModule,
    UsersModule,
    AvailabilityModule
    ],
  controllers: [AppController], 
  providers: [AppService],
})
export class AppModule {}
  