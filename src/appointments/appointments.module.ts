import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from 'src/prisma.service';
import { AvailabilityService } from 'src/availability/availability.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, PrismaService, AvailabilityService],
})
export class AppointmentsModule {}
