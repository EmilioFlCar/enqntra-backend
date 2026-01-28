import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('amenities')
export class AmenitiesController {
    constructor (private amenitiesService: AmenitiesService ){}


    @Get()
    getAmenities(){
        return this.amenitiesService.getAmenities();
    }

    @Roles('ADMIN')
    @Post()
    createAmenity(
        @Body() dto: { names: string[] }
    ){
        return this.amenitiesService.postAmenities(dto.names);
    }
}
