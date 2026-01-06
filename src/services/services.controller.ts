import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ServiceService } from './services.service';
import { CreateBusinessServiceDto } from './dto/create-business-service.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from 'src/common/guards/business-owner.guard';

@Controller('services')
@UseGuards(JwtAuthGuard)

export class ServiceController {
    constructor(private serviceService: ServiceService) {}

    @Get(':id')
    getServicesById(@Param('id') id: string) {
        return this.serviceService.findById(id);
    }

    
    @Patch(':id')
    @UseGuards(BusinessOwnerGuard)
    update(
        @Param('id') id: string, 
        @Body() dto: Partial<CreateBusinessServiceDto>
    ) {
        return this.serviceService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(BusinessOwnerGuard)
    delete(@Param('id') id: string) {
        return this.serviceService.delete(id);
    }

}