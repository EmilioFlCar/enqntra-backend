import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Role } from 'prisma/generated/enums';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    createAppointment(
            dto: CreateAppointmentDto,
            userId: string,
    ){
        return this.prisma.appointment.create({
            data: {
                date: dto.date,
                service: { connect: { id: dto.serviceId } },
                business: { connect: { id: dto.businessId } },
                user: { connect: { id: userId } },
            }
        });
    }

    GetAppointmentsByUser(userId: string) {
        return this.prisma.appointment.findMany({
            where: { userId: userId },
            include: {
                service: true,
                business: true,
            },
        });
    }


    cancelAppointment(appointmentId: string, userId: string, role: Role) {
        const appointment = this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                business: true,
            },
        });
        if (!appointment) {
            throw new NotFoundException();
        }
        if(role === 'USER'){
            this.validateUserAppointmentCancelation(userId, role, appointment);
        }

        if(role === 'BUSINESS'){
            this.validateBusinessAppointmentCancelation(userId, appointment);
        }
        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'CANCELLED',
            },
        })
    }

    confirmationAppointment(appointmentId: string) {
        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'CONFIRMED',
            },
        })
    }

    private validateUserAppointmentCancelation(
        userId: string, 
        role: Role, 
        appointment: any) {
        if (role === 'USER' && appointment.userId !== userId) {
            throw new NotFoundException();
        }
    }
    private validateBusinessAppointmentCancelation(
        userId: string, 
        appointment: any) {
        if (appointment.business.ownerId !== userId) {
            throw new NotFoundException();
        }
    }

}
