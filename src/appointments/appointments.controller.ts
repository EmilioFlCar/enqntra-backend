import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayload } from 'src/common/types/user-payload';
import { Ownership } from 'src/common/decorators/ownership.decorator';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { CreatePublicAppointmentDto } from './dto/create-public-appointment.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('appointments')
export class AppointmentsController {
    constructor( 
        private appointmentsService: AppointmentsService,
    ){}

    @Post()
    create(
        @CurrentUser() user: UserPayload,
        @Body() dto: CreateAppointmentDto,
    ){
        return this.appointmentsService.createAppointment(dto, user.id);
    }

    @Post('public')
    @Public()
    async createPublicAppointment(@Body() dto: CreatePublicAppointmentDto,){
        return await this.appointmentsService.createPublicAppointment(dto);
    }
    
    @Get('user')
    getByUser(
        @CurrentUser() user: UserPayload
    ){
        return this.appointmentsService.getAppointmentsByUser(user.id);
    }

    @Patch(':id/cancel')
    cancelAppointment(
        @Param('id') appointmentId: string,
        @CurrentUser() user: UserPayload
    ){
        return this.appointmentsService.cancelAppointment(appointmentId, user.id, user.role);
    }

    @Patch(':id/confirm')
    @UseGuards(OwnershipGuard)
    @Ownership('appointment')
    confirmAppointment(
        @Param('id') appointmentId: string,
    ){
        return this.appointmentsService.confirmationAppointment(appointmentId);
    }
}