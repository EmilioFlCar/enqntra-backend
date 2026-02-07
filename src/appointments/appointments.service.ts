import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, AppointmentStatus, Role } from 'prisma/generated/client'; 
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailabilityService } from 'src/availability/availability.service';
import { CreatePublicAppointmentDto } from './dto/create-public-appointment.dto';

type AppointmentWithBusiness = Prisma.AppointmentGetPayload<{
    include: {
        business: true;
    };
}>


@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService, private availabilityService: AvailabilityService) { }

    async createAppointment(dto: CreateAppointmentDto, userId: string) {
        const service = await this.validateServiceForAppointmentCreation(
            dto.serviceId, 
            dto.businessId
        );

        const startAt = new Date(dto.startAt);
        const endAt = await this.validateAvailabilityForAppointmentCreation(
            dto.businessId,
            startAt,
            service.durationMinutes,
        );

        return await this.prisma.appointment.create({
            data: {
                startAt,
                endAt,
                service: { connect: { id: dto.serviceId } },
                business: { connect: { id: dto.businessId } },
                user: { connect: { id: userId } },
            }
        });
    }

    async createPublicAppointment(dto: CreatePublicAppointmentDto) {
        const service = await this.validateServiceForAppointmentCreation(
            dto.serviceId, 
            dto.businessId
        );
        const startAt = new Date(dto.startAt);
        const endAt = await this.validateAvailabilityForAppointmentCreation(
            dto.businessId,
            startAt,
            service.durationMinutes,
        );

        return await this.prisma.appointment.create({
            data: {
                startAt,
                endAt,
                service: { connect: { id: dto.serviceId } },
                business: { connect: { id: dto.businessId } },
                
                clientName: dto.clientName,
                clientPhone: dto.clientPhone,
                clientEmail: dto.clientEmail,
            }
        });
    }

    getAppointmentsByUser(userId: string) {
        return this.prisma.appointment.findMany({
            where: { userId: userId },
            include: {
                service: true,
                business: true,
            },
        });
    }


    async cancelAppointment(
        appointmentId: string, 
        userId: string, 
        role: Role
    ) {
        const appointment = await this.prisma.appointment
        .findUnique({
            where: { id: appointmentId },
            include: {
                business: true,
            },
        });
        if (!appointment) {
            throw new NotFoundException();
        }
        if(role === 'USER'){
            this.validateUserAppointmentCancelation(userId, appointment);
        }

        if(role === 'BUSINESS'){
            this.validateBusinessAppointmentCancelation(
                userId, 
                appointment);
        }
        return this.updateAppointmentStatus(appointmentId, AppointmentStatus.CANCELLED);
    }

    confirmationAppointment(
        appointmentId: string
    ) {
        return this.updateAppointmentStatus(appointmentId, AppointmentStatus.CONFIRMED);
    }

    private async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status,
            },
        });
    }

    private async validateServiceForAppointmentCreation(serviceId: string, businessId: string){
        const service = await this.prisma.service.findUnique({
            where: { 
                id: serviceId,
                businessId: businessId
            },
        });

        if (!service) {
            throw new NotFoundException('Servicio no encontrado para el negocio especificado.');
        }

        return service;
    }

    private async validateAvailabilityForAppointmentCreation(
        businessId: string, 
        startAt: Date, 
        durationMinutes: number
    ){
        const dayOfWeek = startAt.getDay();
        const schedule = await this.prisma.schedule.findFirst({
            where: {
                businessId,
                dayOfWeek,
                isActive: true,
            },
        });

        if (!schedule) {
            throw new NotFoundException(
                'El negocio no tiene un horario activo para el día seleccionado.'
            );
        }

        const time = startAt.toTimeString().slice(0, 5);

        if (time < schedule.openTime || time >= schedule.closeTime) {
            throw new NotFoundException('Fuera del horario del negocio');
        }

        const endAt = new Date(startAt.getTime() + durationMinutes * 60000);

        const appointments = await this.availabilityService.getAppointmentsForDate(
            businessId, 
            startAt.toISOString().split('T')[0]);

        if(
            this.availabilityService.isOverlapping(
                startAt, 
                endAt, 
                appointments
            )
        ) {
            throw new NotFoundException(
                'El horario seleccionado no está disponible.'
            );
        }
        return endAt;
    }

    private validateUserAppointmentCancelation(
        userId: string, 
        appointment: AppointmentWithBusiness) {
        if (appointment.userId !== userId) {
            throw new ForbiddenException();
        }
    }
    private validateBusinessAppointmentCancelation(
        userId: string, 
        appointment: AppointmentWithBusiness) {
        if (appointment.business.ownerId !== userId) {
            throw new ForbiddenException();
        }
    }

}