import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AvailabilityService } from './avaliability.service';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { CreateOverrideDto } from './dto/create-override.dto';
import { JwtAuthGuard } from 'src/common/enums/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Role } from 'src/common/enums/decorators/roles.decorator';
import { CurrentUser } from 'src/common/enums/decorators/current-user.decorator';

@ApiTags('Doctor Availability')
@ApiBearerAuth('access-token')
@Controller('doctor/availability')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role('doctor')
export class AvailabilityController {

  constructor(private readonly availabilityService: AvailabilityService) {}

  // POST /doctor/availability
  @Post()
  @ApiOperation({ summary: 'Create recurring availability', description: 'Set weekly recurring availability slot for a specific day' })
  @ApiBody({ schema: { example: { day_of_week: 'monday', start_time: '10:00', end_time: '13:00' } } })
  @ApiResponse({ status: 201, description: 'Recurring availability created' })
  @ApiResponse({ status: 400, description: 'Overlapping slot or invalid time range' })
  createRecurring(@CurrentUser() currentUser: any, @Body() dto: CreateRecurringDto) {
    return this.availabilityService.createRecurring(currentUser.id, dto);
  }

  // GET /doctor/availability
  @Get()
  @ApiOperation({ summary: 'Get all recurring availability', description: 'Returns all weekly availability slots grouped by day' })
  @ApiResponse({ status: 200, description: 'Availability returned grouped by day' })
  getRecurring(@CurrentUser() currentUser: any) {
    return this.availabilityService.getRecurring(currentUser.id);
  }

  // POST /doctor/availability/override
  @Post('override')
  @ApiOperation({ summary: 'Create custom date override', description: 'Override recurring availability for a specific date' })
  @ApiBody({ schema: { example: { date: '2026-06-15', start_time: '14:00', end_time: '15:00', status: 'available', reason: 'Special session' } } })
  @ApiResponse({ status: 201, description: 'Override created successfully' })
  @ApiResponse({ status: 400, description: 'Past date or overlapping slot' })
  createOverride(@CurrentUser() currentUser: any, @Body() dto: CreateOverrideDto) {
    return this.availabilityService.createOverride(currentUser.id, dto);
  }

  // GET /doctor/availability/date?date=2026-06-15
  @Get('date')
  @ApiOperation({ summary: 'Get availability for specific date', description: 'Returns custom override if exists, otherwise returns recurring availability for that day' })
  @ApiQuery({ name: 'date', required: true, example: '2026-06-15' })
  @ApiResponse({ status: 200, description: 'Availability for date returned' })
  getByDate(@CurrentUser() currentUser: any, @Query('date') date: string) {
    return this.availabilityService.getByDate(currentUser.id, date);
  }

  // PATCH /doctor/availability/:id
  @Patch(':id')
  @ApiOperation({ summary: 'Update recurring availability', description: 'Update a specific recurring availability slot by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Availability updated successfully' })
  @ApiResponse({ status: 404, description: 'Slot not found' })
  @ApiResponse({ status: 403, description: 'Not your availability slot' })
  updateRecurring(
    @CurrentUser() currentUser: any,
    @Param('id') id: string,
    @Body() dto: UpdateRecurringDto,
  ) {
    return this.availabilityService.updateRecurring(currentUser.id, +id, dto);
  }

  // DELETE /doctor/availability/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Delete recurring availability', description: 'Soft deletes a recurring availability slot' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Availability deleted successfully' })
  @ApiResponse({ status: 404, description: 'Slot not found' })
  deleteRecurring(
    @CurrentUser() currentUser: any,
    @Param('id') id: string,
  ) {
    return this.availabilityService.deleteRecurring(currentUser.id, +id);
  }
}