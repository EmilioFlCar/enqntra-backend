import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { SchedulesService } from './schedules.service';

@Controller('businesses/:businessId/schedules')
export class BusinessSchedulesController {
    constructor(private scheduleService: SchedulesService) {}

    @Post()
    createSchedule(
        @Body() dto: CreateScheduleDto
    ) {
        return this.scheduleService.createSchedule(dto);
    }

    @Patch(':scheduleId')
    updateSchedule(
        @Param('scheduleId') scheduleId: string,
        @Body() dto: CreateScheduleDto
    ) {
        return this.scheduleService.updateSchedule(scheduleId, dto);
    }
    
    @Get()
    getSchedulesByBusiness(
        @Param('businessId') businessId: string
    ) {
        return this.scheduleService.getSchedulesByBusiness(businessId);
    }

}