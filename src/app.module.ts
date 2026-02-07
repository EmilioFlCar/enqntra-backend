import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaService } from './prisma.service.js';
import { APP_GUARD } from '@nestjs/core';
import { SupabaseAuthGuard } from './common/guards/supabase-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { ServiceModule } from './services/services.module.js';
import { BusinessModule } from './businesses/businesses.module.js';
import { AppointmentsModule } from './appointments/appointments.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AvailabilityModule } from './availability/availability.module.js';
import { AmenitiesModule } from './amenities/amenities.module';
import { SupabaseModule } from './supabase/supabase.module.js';

@Module({
  imports: [SupabaseModule, UserModule, AuthModule, BusinessModule, ServiceModule, AppointmentsModule, SchedulesModule, AvailabilityModule, AmenitiesModule],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
