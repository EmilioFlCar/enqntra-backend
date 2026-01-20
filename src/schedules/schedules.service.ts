import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
    constructor(private prisma: PrismaService) {}

        async createSchedule(dto: CreateScheduleDto) {
            return await this.prisma.schedule.create({
                data: {
                    dayOfWeek: dto.dayOfWeek,
                    openTime: dto.openTime,
                    closeTime: dto.closeTime,
                    isActive: dto.isActive,
                    business: { connect: { id: dto.businessId } },
                }
            });
        }

        async updateSchedule(scheduleId: string, dto: CreateScheduleDto) {
            return await this.prisma.schedule.update({
                where: { id: scheduleId },
                data: {
                    dayOfWeek: dto.dayOfWeek,
                    openTime: dto.openTime,
                    closeTime: dto.closeTime,
                    isActive: dto.isActive,
                }
            });
        }

        async deleteSchedule(scheduleId: string) {
            return await this.prisma.schedule.delete({
                where: { id: scheduleId },
            });
        }

        async getSchedulesByBusiness(businessId: string) {
            return await this.prisma.schedule.findMany({
                where: { businessId: businessId },
            });
        }
    }