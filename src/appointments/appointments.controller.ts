import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayload } from 'src/common/types/user-payload';
import { Ownership } from 'src/common/decorators/ownership.decorator';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
    constructor( 
        private appointmentsService: AppointmentsService,
    ){}

    @Post()
    create(
        @CurrentUser() user: UserPayload,
        @Body() dto: CreateAppointmentDto,
    ){
        return this.appointmentsService.createAppointment({...dto}, user.id);
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