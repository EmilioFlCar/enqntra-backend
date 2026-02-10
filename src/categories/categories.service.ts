import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async getCategories() {
        return this.prisma.category.findMany({
            select: { id: true, name: true },
        });
    }
}
