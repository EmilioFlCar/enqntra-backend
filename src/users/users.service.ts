import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from 'prisma/generated/enums';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAllUsers() {
    return this.prisma.user.findMany();
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  promoteUserToBusiness(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.BUSINESS },
    });
  }
}
