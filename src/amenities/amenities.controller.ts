import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('amenities')
export class AmenitiesController {
    constructor (private amenitiesService: AmenitiesService ){}

    @Public()
    @Get()
    getAmenities(){
        return this.amenitiesService.getAmenities();
    }

    @Roles('ADMIN')
    @Post()
    createAmenity(
        @Body() dto: { amenities: { name: string, slug?: string }[] }
    ){
        return this.amenitiesService.postAmenities(dto.amenities);
    }

    @Roles('ADMIN')
    @Post('batch')
    createAmenityBatch(
        @Body() dto: { amenities: { name: string, slug?: string }[] }
    ){
        return this.amenitiesService.postAmenities(dto.amenities);
    }
}
