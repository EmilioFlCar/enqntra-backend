import { Body, Controller, Get, Post } from '@nestjs/common';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
    constructor(private scheduleService: SchedulesService) {}

    @Get()
    getSchedulesByBusiness(
        @Body('businessId') businessId: string
    ) {
        return this.scheduleService.getSchedulesByBusiness(businessId);
    }

}
