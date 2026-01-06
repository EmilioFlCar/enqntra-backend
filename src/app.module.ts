import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaService } from './prisma.service.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { ServiceModule } from './services/services.module.js';
import { BusinessModule } from './businesses/businesses.module.js';
import { BusinessOwnerGuard } from './common/guards/business-owner.guard.js';


@Module({
  imports: [UserModule, AuthModule, BusinessModule, ServiceModule],
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
        {
      provide: APP_GUARD,
      useClass: BusinessOwnerGuard,
    },
  ],
})
export class AppModule {}
