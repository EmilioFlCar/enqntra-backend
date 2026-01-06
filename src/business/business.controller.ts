import { Body, Controller, Get, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayload } from 'src/common/types/user-payload';
import { UsersService } from 'src/users/users.service';

@Controller('business')
export class BusinessController {
    constructor(
        private businessService: BusinessService,
        private UserServive: UsersService,
    ) {}

    @Get()
    getAllBusinesses() {
        return this.businessService.getAllBusinesses();
    }

    @Get('/:id')
    getBusinessById(@Param('id') id: string) {
        return this.businessService.getBusinessById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
        async  createBusiness(
            @Body() body: CreateBusinessDto, 
            @CurrentUser()user: UserPayload
        ) {
            const business = await this.businessService.createBusiness(body, user.id);
            await this.UserServive.promoteUserToBusiness(user.id);
            return business;

        }
    

}
