import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class BusinessOwnerGuard implements CanActivate {
    constructor(private prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise <boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const businessId = request.params.businessId;
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
        });
        if (!business) {
            throw new ForbiddenException('Business not found');
        }
            
        if (business.ownerId !== user.id) {
            throw new ForbiddenException('You do not own this business');
        }
        return true;
    }
}