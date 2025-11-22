import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaService } from '../prisma.service.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '7d' },
  }),
  ],
  providers: [AuthService, PrismaService,],
  controllers: [AuthController]
})
export class AuthModule {}
