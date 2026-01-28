import { Body, Controller, Delete, Param, Post, UseGuards } from "@nestjs/common";
import { AmenitiesService } from "./amenities.service";
import { Ownership } from "src/common/decorators/ownership.decorator";
import { OwnershipGuard } from "src/common/guards/ownership.guard";

@Controller('businesses/:businessId/amenities')
export class BusinessAmenitiesController {
    constructor(private amenitiesService: AmenitiesService) {}

    @Post()
    @Ownership('business')
    @UseGuards(OwnershipGuard)
    createBusinessAmenities(
        @Param('businessId') businessId: string,
        @Body() dto: { amenityIds: string[] }
    ){
        return this.amenitiesService.postBusinessAmenity(businessId, dto.amenityIds);
    }

    @Delete(':amenityId')
    @Ownership('business')
    @UseGuards(OwnershipGuard)
    deleteBusinessAmenities(
        @Param('businessId') businessId: string,
        @Param('amenityId') amenityId: string
    ){
        return this.amenitiesService.deleteBusinessAmenity(businessId, amenityId);
    }

}