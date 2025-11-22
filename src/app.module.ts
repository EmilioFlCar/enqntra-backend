import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaService } from './prisma.service.js';


@Module({
  imports: [UsersModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
