import { Module } from '@nestjs/common';
import { ServiceController } from './services.controller';
import { ServiceService } from './services.service';
import { PrismaService } from 'src/prisma.service';
import { BusinessServicesController } from './business-services.controller';

@Module({
  controllers: [ServiceController, BusinessServicesController],
  providers: [ServiceService, PrismaService]

})
export class ServiceModule {}
