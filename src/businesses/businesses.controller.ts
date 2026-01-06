import { Body, Controller, Get, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { BusinessService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayload } from 'src/common/types/user-payload';
import { UserService } from 'src/users/users.service';

@Controller('businesses')
export class BusinessController {
    constructor(
        private businessService: BusinessService,
        private userService: UserService,
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
            await this.userService.promoteUserToBusiness(user.id);
            return business;

        }
    

}
