import { Controller, Get, Post, Body, Patch, Param, UseGuards} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { UpdateDoctorDto } from './dto/update-profile.dto';
import { CompleteProfileDto } from './dto/profile-complition.dto';
import { JwtAuthGuard } from 'src/common/enums/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Role } from 'src/common/enums/decorators/roles.decorator';
import { CurrentUser } from 'src/common/enums/decorators/current-user.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';



@ApiBearerAuth('access-token')
@Controller('doctor')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('doctor')
  findAll(@CurrentUser() currentUser: any) {
    return this.doctorsService.getDoctorProfile(currentUser.id);
  }
  

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('doctor')
  @ApiOperation({ 
    summary: 'Complete doctor profile',
    description: 'Fill in remaining profile details after registration. Can only be done once. Use PATCH to update later'
  })
   @ApiBody({
    schema: {
      example: {
        experience_years: 5,
        qualification: 'MBBS, MD',
        consultation_fee: 500,
        phone: '9876543210',
        gender: 'male',
        bio: 'Experienced cardiologist with 5 years of practice',
        clinic_name: 'Sharma Heart Clinic',
        clinic_address: 'Sector 17, Chandigarh'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Profile completed successfully' })
  @ApiResponse({ status: 400, description: 'Profile already completed. Use PATCH to update' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@CurrentUser() currentUser: any, @Body() dto:CompleteProfileDto) {
    return this.doctorsService.completeDoctorProfile(currentUser.id,dto);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('doctor')
  @ApiOperation({ 
    summary: 'Update doctor profile',
    description: 'Update any profile field. All fields are optional. Only send fields you want to update'
  })
  @ApiBody({
    schema: {
      example: {
        consultation_fee: 700,
        bio: 'Updated bio here',
        clinic_address: 'New address'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@CurrentUser() currentUser: any, @Body() dto:UpdateDoctorDto) {
    return this.doctorsService.updateProfile(currentUser.id,dto);
  }

}
