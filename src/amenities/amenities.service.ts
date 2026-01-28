import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AmenitiesService {
    constructor(private prisma: PrismaService) { }

    async postBusinessAmenity(businessId: string, amenityIds: string[]) {
        return this.prisma.businessAmenity.createMany({
            data: amenityIds.map((amenityId) => ({
                businessId,
                amenityId,
            })),
            skipDuplicates: true,
        });
    }

    async deleteBusinessAmenity(businessId: string, amenityId: string) {
        return this.prisma.businessAmenity.deleteMany({
            where: {
                businessId,
                amenityId,
            },
        });
    }

    async getBusinessAmenities(businessId: string) {
        return this.prisma.business.findUnique({
            where: { id: businessId },
            include: { amenities: {
                include: { amenity: true }
            } },
        })
    }

    async postAmenity(name: string) {
        return this.prisma.amenity.create({
            data: {
                name,
            },
        });
    }

    async postAmenities(names: string[]) {
        const amenitiesData = names.map((name) => ({ name }));
        return this.prisma.amenity.createMany({
            data: amenitiesData,
            skipDuplicates: true,
        });
    }

    async getAmenities(){
        return this.prisma.amenity.findMany();
    }

    async updateAmenity(id: string, name: string) {
        return this.prisma.amenity.update({
            where: { id },
            data: { name },
        });
    }
    async deleteAmenity(id: string) {
        return this.prisma.amenity.delete({
            where: { id },
        });
    }
}
