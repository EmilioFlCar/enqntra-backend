import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaService } from './prisma.service.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { ServiceModule } from './services/services.module.js';
import { BusinessModule } from './businesses/businesses.module.js';
import { AppointmentsModule } from './appointments/appointments.module';


@Module({
  imports: [UserModule, AuthModule, BusinessModule, ServiceModule, AppointmentsModule],
  providers: [
    PrismaService, 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
