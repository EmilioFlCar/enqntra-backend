import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { PrismaService } from 'src/prisma.service';
import { BusinessSchedulesController } from './business-schedules.controller';

@Module({
  controllers: [SchedulesController, BusinessSchedulesController],
  providers: [SchedulesService, PrismaService]
})
export class SchedulesModule {}
