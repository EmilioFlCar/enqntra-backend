import { Module } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesController } from './amenities.controller';
import { PrismaService } from 'src/prisma.service';
import { BusinessAmenitiesController } from './business-amenities.controller';

@Module({
  providers: [AmenitiesService, PrismaService],
  controllers: [AmenitiesController, BusinessAmenitiesController]
})
export class AmenitiesModule {}
