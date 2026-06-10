import { Controller, Get, Post, Patch, Body, UseGuards ,Param ,Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CompleteUserProfileDto } from './dto/complete-profile.dto';
import { UpdateUserDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/common/enums/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Role } from 'src/common/enums/decorators/roles.decorator';
import { CurrentUser } from 'src/common/enums/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
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
  completeProfile(
    @CurrentUser() currentUser: any,
    @Body() dto: CompleteUserProfileDto,
  ) {
    return this.usersService.completeProfile(currentUser.id, dto);
  }


  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Role('user')
  updateProfile(
    @CurrentUser() currentUser: any,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(currentUser.id, dto);
  }

  @Get('doctors')
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Role('user')
searchDoctors(@Query() query: QueryDoctorDto) {
  return this.usersService.searchDoctors(query);
}

@Get('doctors/:id')
@UseGuards(JwtAuthGuard, RolesGuard)  
@Role('user')
getDoctorById(@Param('id') id: string) {
  return this.usersService.getDoctorById(+id); // ← +id converts string to number
}

}