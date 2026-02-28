import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

export type CategoryNode = {
    id: string;
    name: string;
    slug: string;
    depth: number;
    parentId?: string | null;
    children: CategoryNode[];
};

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async getCategories() {
        const categories = await this.prisma.category.findMany({
            orderBy: [{ depth: 'asc' }, { name: 'asc' }],
            select: {
                id: true,
                name: true,
                slug: true,
                depth: true,
                parentId: true,
            },
        });

        const nodes = new Map<string, CategoryNode>();
        const roots: CategoryNode[] = [];

        for (const category of categories) {
            nodes.set(category.id, { ...category, children: [] });
        }

        for (const node of nodes.values()) {
            if (!node.parentId) {
                roots.push(node);
                continue;
            }

            const parent = nodes.get(node.parentId);
            if (parent) {
                parent.children.push(node);
            } else {
                roots.push(node);
            }
        }

        return roots;
    }
}
