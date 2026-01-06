import { Module } from '@nestjs/common';
import { UserController } from './users.controller.js';
import { UserService } from './users.service.js';
import { PrismaService } from '../prisma.service.js';


@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService]
})
export class UserModule {}
