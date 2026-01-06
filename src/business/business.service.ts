import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { PrismaService } from '../prisma.service.js';


@Injectable()
export class BusinessService {
    constructor(private prisma: PrismaService) {}

    getAllBusinesses() {
        return this.prisma.business.findMany();
    }

    getBusinessById(id: string) {
        return this.prisma.business.findUnique({
            where: { id },
        });
    }

    createBusiness(dto: CreateBusinessDto, ownerId: string) {
        return this.prisma.business.create({
            data: {
                ...dto,
                owner:{ connect: { id: ownerId } },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }
    
}
