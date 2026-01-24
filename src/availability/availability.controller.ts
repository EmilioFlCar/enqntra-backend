import { Body, Controller, Get } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { GetAvailabilityDto } from './dto/get-availability.dto';

@Controller('availability')
export class AvailabilityController {
    constructor(
        private availabilityService: AvailabilityService,
    ){}

    @Get()
    getAvailability(@Body() dto: GetAvailabilityDto) {
        return this.availabilityService.getAvailability(dto);
    }
}
