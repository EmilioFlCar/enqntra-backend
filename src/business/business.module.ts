import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { PrismaService } from '../prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService,UsersService, PrismaService],
})
export class BusinessModule {}
