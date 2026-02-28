import { Module } from '@nestjs/common';
import { BusinessController } from './businesses.controller';
import { BusinessService } from './businesses.service';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { PrismaService } from '../prisma.service';
import { UserService } from 'src/users/users.service';

@Module({
  controllers: [BusinessController, OnboardingController],
  providers: [BusinessService, OnboardingService, UserService, PrismaService],
})
export class BusinessModule {}
