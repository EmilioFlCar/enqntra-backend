import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/prisma.service";
import { OWNERSHIP_KEY } from "../decorators/ownership.decorator";

@Injectable()
export class OwnershipGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise <boolean> {
        const resource = this.reflector.get<string>(OWNERSHIP_KEY, context.getHandler());
        if (!resource) return true;

        const request = context.switchToHttp().getRequest();
        const userId = request.user.id;
        const businessId = request.params.id;

        let ownerId: string | null = null;

        if (resource === 'business') {
            const business = await this.prisma.business.findUnique({
                where: { id: businessId },
            });

            if(!business) throw new NotFoundException('Resource not found');

            ownerId = business?.ownerId ?? null;
        }

        if (resource === 'service') {
            const service = await this.prisma.service.findUnique({
                where: { id: businessId },
                select: {
                    business: { 
                        select: { ownerId: true } 
                    },
                },
            });
            if(!service) throw new NotFoundException('Resource not found');
            ownerId = service?.business?.ownerId ?? null;
        }

        if (ownerId !== userId) {
            throw new ForbiddenException('You do not own this resource');
        }

        return true;
    }
}