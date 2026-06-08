import { Controller, Get, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CompleteUserProfileDto } from './dto/complete-profile.dto';
import { UpdateUserDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/common/enums/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Role } from 'src/common/enums/decorators/roles.decorator';
import { CurrentUser } from 'src/common/enums/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)  // ← all routes protected
@Role('user')                          // ← only users allowed
@ApiBearerAuth('access-token')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  // GET /user/profile
  @Get('profile')
  getProfile(@CurrentUser() currentUser: any) {
    return this.usersService.getProfile(currentUser.id);
  }

  // POST /user/profile
  @Post('profile')
  completeProfile(
    @CurrentUser() currentUser: any,
    @Body() dto: CompleteUserProfileDto,
  ) {
    return this.usersService.completeProfile(currentUser.id, dto);
  }

  // PATCH /user/profile
  @Patch('profile')
  updateProfile(
    @CurrentUser() currentUser: any,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(currentUser.id, dto);
  }
}