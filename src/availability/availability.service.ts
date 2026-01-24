import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetAvailabilityDto } from './dto/get-availability.dto';
import { Appointment } from 'prisma/generated/browser';

@Injectable()
export class AvailabilityService {
    constructor(private prisma: PrismaService){}

    private timeToDate(date: string, time: string): Date {
        return new Date(`${date}T${time}:00.000Z`);
    }

    isOverlapping(slotStart: Date, slotEnd: Date, appointments: Appointment[]): boolean {
        return appointments.some(a => slotStart < a.endAt && slotEnd > a.startAt);
    }

    async getAppointmentsForDate(businessId: string, date: string): Promise<Appointment[]> {

        const dayStart = new Date(`${date}T00:00:00.000Z`);
        const dayEnd = new Date(`${date}T23:59:59.999Z`);

        return await this.prisma.appointment.findMany({
            where:{
                businessId,
                status: 'CONFIRMED',
                startAt: {
                    gte: dayStart, 
                    lte: dayEnd
                }
            }
        })
    }
    
    async getAvailability(dto: GetAvailabilityDto) {
        const { businessId, serviceId, date } = dto;


        // Service validation
        const service = await this.prisma.service.findFirst({
            where: { id: serviceId, businessId: businessId },
        });
        
        if (!service) {
            throw new NotFoundException('Service not found for the given business.');
        }

        //Schedule validation
        const requestedDate = new Date(`${date}T00:00:00.000Z`);
        const dayOfWeek = requestedDate.getUTCDay();

        const schedule = await this.prisma.schedule.findFirst({
            where: {
                businessId,
                dayOfWeek,
                isActive: true,
            },
        });
        if (!schedule) {
            return {
                date,
                slots: []
            }
        }

        const appointments =  await this.getAppointmentsForDate(businessId, date);

        const SLOT_MINUTES = service.durationMinutes;
        const openAt = this.timeToDate(date, schedule.openTime);
        const closeAt = this.timeToDate(date, schedule.closeTime);

        const slots: Date[] = []
        let currentSlot = new Date(openAt);
        while (currentSlot < closeAt) {
            slots.push(currentSlot);
            currentSlot = new Date(currentSlot.getTime() + SLOT_MINUTES * 60000);
        }

        const durationMs = service.durationMinutes * 60000;
        
        const availableSlots = slots.filter(slotStart =>{
            const slotEnd = new Date(slotStart.getTime()+ durationMs);
            if (slotEnd > closeAt) return false;

            return !this.isOverlapping(slotStart, slotEnd, appointments);

        })

        return {
        date,
        slots: availableSlots.map((slot) =>
            slot.toISOString().substring(11, 16) // "HH:mm"
        ),
        };
    }
}
