import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/enums/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Role } from 'src/common/enums/decorators/roles.decorator';
import { CurrentUser } from 'src/common/enums/decorators/current-user.decorator';
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

 

  @Post('register/user')
  registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('register/doctor')
  registerDoctor(@Body() dto: RegisterDoctorDto) {
    return this.authService.registerDoctor(dto);
  }

  @Post('login')                    
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }


  // @Get('user/profile')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Role('user')                     
  // getUserProfile(@CurrentUser() currentUser: any) {
  //   return this.authService.getUserProfile(currentUser.id);
  // }

  // @Get('doctor/profile')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Role('doctor')                 
  // getDoctorProfile(@CurrentUser() currentUser: any) {
  //   return this.authService.getDoctorProfile(currentUser.id);
  // }
}