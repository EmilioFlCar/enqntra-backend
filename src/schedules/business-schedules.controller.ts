import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { BatchUpdateSchedulesDto } from './dto/batch-update-schedules.dto';
import { SchedulesService } from './schedules.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('businesses/:businessId/schedules')
export class BusinessSchedulesController {
  constructor(private scheduleService: SchedulesService) {}

  @Post()
  createSchedule(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.createSchedule(dto);
  }

  // Batch route declared BEFORE /:scheduleId to avoid NestJS treating "batch" as an ID
  @Patch('batch')
  batchUpdateSchedules(@Body() dto: BatchUpdateSchedulesDto) {
    return this.scheduleService.batchUpdateSchedules(dto);
  }

  @Patch(':scheduleId')
  updateSchedule(
    @Param('scheduleId') scheduleId: string,
    @Body() dto: CreateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(scheduleId, dto);
  }

  @Public()
  @Get()
  getSchedulesByBusiness(@Param('businessId') businessId: string) {
    return this.scheduleService.getSchedulesByBusiness(businessId);
  }
}
