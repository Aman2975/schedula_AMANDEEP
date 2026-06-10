import { Controller, Get, Post, Patch, Body, UseGuards ,Param ,Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CompleteUserProfileDto } from './dto/complete-profile.dto';
import { UpdateUserDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/common/enums/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Role } from 'src/common/enums/decorators/roles.decorator';
import { CurrentUser } from 'src/common/enums/decorators/current-user.decorator';
import { ApiBearerAuth , ApiOperation, ApiResponse, ApiQuery, ApiTags,  ApiBody, ApiParam } from '@nestjs/swagger';
import { QueryDoctorDto } from './dto/query-doctor.dto';

@ApiBearerAuth('access-token')
@Controller('user')                          
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Role('user')
  getProfile(@CurrentUser() currentUser: any) {
    return this.usersService.getProfile(currentUser.id);
  }



  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Role('user')
  @ApiOperation({ 
    summary: 'Complete user profile',
    description: 'Fill in remaining profile details after registration. Can only be done once. Use PATCH to update later'
  })
  @ApiBody({
    schema: {
      example: {
        gender: 'male',
        date_of_birth: '1998-05-15',
        address: 'Sector 22, Chandigarh',
        emergency_contact_name: 'Gurpreet Singh',
        emergency_contact_phone: '9876543210',
        blood_group: 'B+',
        allergies: 'Penicillin',
        medical_note: 'Diabetic patient'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Profile completed successfully' })
  @ApiResponse({ status: 400, description: 'Profile already completed. Use PATCH to update' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  completeProfile(
    @CurrentUser() currentUser: any,
    @Body() dto: CompleteUserProfileDto,
  ) {
    return this.usersService.completeProfile(currentUser.id, dto);
  }


  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Role('user')
   @ApiOperation({ 
    summary: 'Update user profile',
    description: 'Update any profile field. All fields are optional. Only send fields you want to update'
  })
  @ApiBody({
    schema: {
      example: {
        address: 'Sector 35, Chandigarh',
        phone: '9812345678',
        medical_note: 'Updated medical notes'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProfile(
    @CurrentUser() currentUser: any,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(currentUser.id, dto);
  }

  @Get('doctors')
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Role('user')
  @ApiOperation({ 
  summary: 'Search doctors',
  description: 'Search and filter doctors by name, specialization, clinic etc'
})
@ApiQuery({ name: 'search', required: false, description: 'Search by name or email' })
@ApiQuery({ name: 'specialization', required: false })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'limit', required: false, example: 10 })
@ApiResponse({ status: 200, description: 'Returns list of doctors' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
searchDoctors(@Query() query: QueryDoctorDto) {
  return this.usersService.searchDoctors(query);
}


@ApiOperation({ 
    summary: 'Get doctor by ID',
    description: 'Returns complete profile of a specific doctor by their ID'
  })
  @ApiParam({ name: 'id', description: 'Doctor ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Doctor profile returned successfully',
    schema: {
      example: {
        id: 1,
        name: 'Dr. Rahul Sharma',
        email: 'rahul@gmail.com',
        specialization: 'Cardiologist',
        consultation_fee: 500,
        clinic_name: 'Sharma Heart Clinic',
        clinic_address: 'Sector 17, Chandigarh',
        experience_years: 5,
        qualification: 'MBBS, MD',
        gender: 'male',
        bio: 'Experienced cardiologist'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
@Get('doctors/:id')
@UseGuards(JwtAuthGuard, RolesGuard)  
@Role('user')
getDoctorById(@Param('id') id: string) {
  return this.usersService.getDoctorById(+id); // ← +id converts string to number
}

}