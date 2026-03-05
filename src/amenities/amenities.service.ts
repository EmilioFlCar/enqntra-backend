import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  async setBusinessAmenities(businessId: string, amenityIds: string[]) {
    return this.prisma.$transaction(async (tx) => {
      await tx.businessAmenity.deleteMany({
        where: { businessId },
      });

      if (amenityIds.length === 0) {
        return { count: 0 };
      }

      return tx.businessAmenity.createMany({
        data: amenityIds.map((amenityId) => ({
          businessId,
          amenityId,
        })),
        skipDuplicates: true,
      });
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
    return this.prisma.businessAmenity.findMany({
      where: { businessId },
      include: {
        amenity: true,
      },
    });
  }

  async postAmenity({ name, slug }: { name: string; slug?: string }) {
    return this.prisma.amenity.create({
      data: {
        name,
        slug,
      },
    });
  }

  async postAmenities(amenities: { name: string; slug?: string }[]) {
    const amenitiesData = amenities.map((amenity) => ({
      name: amenity.name,
      slug: amenity.slug,
    }));
    return this.prisma.amenity.createMany({
      data: amenitiesData,
      skipDuplicates: true,
    });
  }

  async getAmenities() {
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
