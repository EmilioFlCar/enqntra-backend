import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ServiceService } from "./services.service";
import { CreateBusinessServiceDto } from "./dto/create-business-service.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { UserPayload } from "src/common/types/user-payload";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Ownership } from "src/common/decorators/ownership.decorator";
import { OwnershipGuard } from "src/common/guards/ownership.guard";

@Controller('businesses/:businessId/services')

export class BusinessServicesController {
    constructor(private serviceService: ServiceService) {}

    @Post()
    @Ownership('business')
    @UseGuards(JwtAuthGuard, OwnershipGuard)
    create(
        @Param('businessId') businessId: string,
        @Body() dto: CreateBusinessServiceDto,
        @CurrentUser() user: UserPayload
    ) { 
        return this.serviceService.create(dto, businessId);
    }

    @Get()
    findByBusiness(
        @Param('businessId') businessId: string
    ) {
        return this.serviceService.findByBusiness(businessId);
    }
}