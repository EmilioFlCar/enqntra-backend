import { Module } from '@nestjs/common';
import { BusinessController } from './businesses.controller';
import { BusinessService } from './businesses.service';
import { PrismaService } from '../prisma.service';
import { UserService } from 'src/users/users.service';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService,UserService, PrismaService],
})
export class BusinessModule {}
