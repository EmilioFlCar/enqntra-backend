import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { Ownership } from 'src/common/decorators/ownership.decorator';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('businesses/:businessId/amenities')
export class BusinessAmenitiesController {
  constructor(private amenitiesService: AmenitiesService) {}

  @Post()
  @Ownership('business')
  @UseGuards(OwnershipGuard)
  createBusinessAmenities(
    @Param('businessId') businessId: string,
    @Body() dto: { amenityIds: string[] },
  ) {
    return this.amenitiesService.setBusinessAmenities(
      businessId,
      dto.amenityIds,
    );
  }

  @Delete(':amenityId')
  @Ownership('business')
  @UseGuards(OwnershipGuard)
  deleteBusinessAmenities(
    @Param('businessId') businessId: string,
    @Param('amenityId') amenityId: string,
  ) {
    return this.amenitiesService.deleteBusinessAmenity(businessId, amenityId);
  }

  @Public()
  @Get()
  getBusinessAmenities(@Param() params: { businessId: string }) {
    return this.amenitiesService.getBusinessAmenities(params.businessId);
  }
}
