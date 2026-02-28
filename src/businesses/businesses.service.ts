import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { PrismaService } from '../prisma.service.js';

const CATEGORY_SELECT = {
    id: true,
    name: true,
    slug: true,
    depth: true,
    parentId: true,
};

@Injectable()
export class BusinessService {
    constructor(private prisma: PrismaService) {}

    private mapBusinessCategories<T extends { categories: { category: any }[] }>(business: T) {
        const { categories, ...rest } = business as any;
        return {
            ...rest,
            categories: categories.map((connection: any) => connection.category),
        };
    }

    async getAllBusinesses() {
        const businesses = await this.prisma.business.findMany({
            include: {
                categories: {
                    include: { category: { select: CATEGORY_SELECT } },
                },
            },
        });
        return businesses.map((business) => this.mapBusinessCategories(business));
    }

    async getBusinessById(id: string) {
        const business = await this.prisma.business.findUnique({
            where: { id },
            include: {
                categories: {
                    include: { category: { select: CATEGORY_SELECT } },
                },
            },
        });
        if (!business) return null;
        return this.mapBusinessCategories(business);
    }

    createBusiness(ownerId: string, dto?: CreateBusinessDto) {
        return this.prisma.business.create({
            data: {
                ...dto,
                ownerId,
            },
        });
    }
}
