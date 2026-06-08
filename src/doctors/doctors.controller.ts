import { Controller, Get, Post, Body, Patch, Param, UseGuards} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { UpdateDoctorDto } from './dto/update-profile.dto';
import { CompleteProfileDto } from './dto/profile-complition.dto';
import { JwtAuthGuard } from 'src/common/enums/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Role } from 'src/common/enums/decorators/roles.decorator';
import { CurrentUser } from 'src/common/enums/decorators/current-user.decorator';

@Controller('doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role('dcotor')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  
  @Get('profile')
  findAll(@CurrentUser() currentUser: any) {
    return this.doctorsService.getDoctorProfile(currentUser.id);
  }
  
  @Post('profile')
  create(@CurrentUser() currentUser: any, @Body() dto:CompleteProfileDto) {
    return this.doctorsService.completeDoctorProfile(currentUser.id,dto);
  }

  @Patch('profile')
  update(@CurrentUser() currentUser: any, @Body() dto:UpdateDoctorDto) {
    return this.doctorsService.updateProfile(currentUser.id,dto);
  }

}
