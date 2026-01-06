import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBusinessServiceDto } from './dto/create-business-service.dto';

@Injectable()
export class ServiceService {
    constructor(private prisma: PrismaService) {}

    create(
        @Body() dto: CreateBusinessServiceDto,
        businessId: string 
    ) {
        return this.prisma.service.create({
            data: {
                ...dto,
                business: { connect: { id: businessId } },
            }
        });
    }

    findByBusiness(businessId: string) {
        return this.prisma.service.findMany({
            where: { businessId },
        });
    }

    findById(id: string) {
        return this.prisma.service.findUnique({
            where: { id },
        });
    }

    update(id: string, dto: Partial<CreateBusinessServiceDto>) {
        return this.prisma.service.update({
            where: { id },
            data: {
                ...dto,
            }
        });
    }
    delete(id: string) {
        return this.prisma.service.delete({
            where: { id },
        });
    }
}