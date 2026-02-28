import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

const BEAUTY_SUBCATEGORIES = [
    'Barbería',
    'Peluquería',
    'Uñas',
    'Cejas',
    'Pestañas',
    'Maquillaje',
    'Depilación',
    'Spa',
];

const slugify = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') ||
    `slug-${Date.now()}`;

async function main() {
    const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    const prisma = new PrismaClient({ adapter: pool });

    const beautySlug = slugify('Belleza');
    const beauty = await prisma.category.upsert({
        where: { slug: beautySlug },
        update: { name: 'Belleza' },
        create: {
            name: 'Belleza',
            slug: beautySlug,
            depth: 0,
        },
    });

    for (const name of BEAUTY_SUBCATEGORIES.slice(0, 10)) {
        const slug = slugify(name);
        await prisma.category.upsert({
            where: { slug },
            update: { name, parentId: beauty.id, depth: 1 },
            create: {
                name,
                slug,
                depth: 1,
                parentId: beauty.id,
            },
        });
    }

    console.log('Seeded Belleza niche with subcategories');
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
