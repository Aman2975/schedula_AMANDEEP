import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/enums/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Role } from 'src/common/enums/decorators/roles.decorator';
import { CurrentUser } from 'src/common/enums/decorators/current-user.decorator';
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

 // POST /auth/register/user
  @Post('register/user')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account with email and password'
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Aman Singh',
        email: 'aman@gmail.com',
        phone: '9876543210',
        password: 'aman@123'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Post('register/user')
  registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }
  

   // POST /auth/register/doctor
  @Post('register/doctor')
  @ApiOperation({ 
    summary: 'Register a new doctor',
    description: 'Creates a new doctor account with email, password and specialization'
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Dr. Rahul Sharma',
        email: 'rahul@gmail.com',
        specialization: 'Cardiologist',
        password: 'rahul@123'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Doctor registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Post('register/doctor')
  registerDoctor(@Body() dto: RegisterDoctorDto) {
    return this.authService.registerDoctor(dto);
  }


  // POST /auth/login
  @Post('login')
  @ApiOperation({ 
    summary: 'Login for user or doctor',
    description: 'Authenticates user or doctor based on role field and returns JWT token'
  })
  @ApiBody({
    schema: {
      example: {
        email: 'aman@gmail.com',
        password: 'aman@123',
        role: 'user'            // ← user or doctor
      }
    }
  })
  
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