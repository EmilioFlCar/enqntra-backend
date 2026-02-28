import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OnboardingStep } from 'prisma/generated/enums';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
    CategoryStepDataDto,
    BusinessInfoStepDataDto,
    ScheduleStepDataDto,
    ServicesStepDataDto,
} from './dto/onboarding-step.dto';

const STEP_TRANSITIONS: Record<string, OnboardingStep> = {
    NOT_STARTED: 'CATEGORY',
    CATEGORY: 'BUSINESS_INFO',
    BUSINESS_INFO: 'SCHEDULE',
    SCHEDULE: 'SERVICES',
    SERVICES: 'COMPLETED',
};

@Injectable()
export class OnboardingService {
    constructor(private prisma: PrismaService) {}

    async advanceOnboarding(businessId: string, step: OnboardingStep, data: any) {
        const business = await this.prisma.business.findUnique({ where: { id: businessId } });
        if (!business) throw new NotFoundException('Business not found');

        if (business.onboardingCompletedAt) {
            throw new BadRequestException('Onboarding already completed');
        }

        const expectedStep = STEP_TRANSITIONS[business.onboardingStep];
        if (!expectedStep || (step !== expectedStep && step !== business.onboardingStep)) {
            throw new BadRequestException(
                `Invalid step. Expected "${expectedStep}" or current "${business.onboardingStep}", received "${step}"`,
            );
        }

        await this.validateAndPersist(businessId, step, data);

        // Only advance to next step for specific handlers
        let nextStep: OnboardingStep;
        switch (step) {
            case 'BUSINESS_INFO':
                nextStep = 'SCHEDULE';
                break;
            case 'SCHEDULE':
                nextStep = 'SERVICES';
                break;
            case 'SERVICES':
                nextStep = 'COMPLETED';
                break;
            default:
                nextStep = step; // No advance (e.g., CATEGORY)
                break;
        }

        return this.prisma.business.update({
            where: { id: businessId },
            data: {
                onboardingStep: nextStep,
                ...(nextStep === 'COMPLETED' ? { onboardingCompletedAt: new Date() } : {}),
            },
        });
    }

    private async validateAndPersist(businessId: string, step: OnboardingStep, data: any) {
        switch (step) {
            case 'CATEGORY':
                return this.handleCategoryStep(businessId, data);
            case 'BUSINESS_INFO':
                return this.handleBusinessInfoStep(businessId, data);
            case 'SCHEDULE':
                return this.handleScheduleStep(businessId, data);
            case 'SERVICES':
                return this.handleServicesStep(businessId, data);
            default:
                throw new BadRequestException('Unhandled step');
        }
    }

    private async validateDto<T extends object>(cls: new () => T, data: any): Promise<T> {
        const instance = plainToInstance(cls, data);
        const errors = await validate(instance, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0) {
            const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}));
            throw new BadRequestException(messages);
        }
        return instance;
    }

    private async handleCategoryStep(businessId: string, data: any) {
        const dto = await this.validateDto(CategoryStepDataDto, data);
        const uniqueCategoryIds = Array.from(new Set(dto.categoryIds));

        const categories = await this.prisma.category.findMany({
            where: { id: { in: uniqueCategoryIds } },
            select: { id: true, depth: true, parentId: true },
        });

        if (categories.length !== uniqueCategoryIds.length) {
            throw new BadRequestException('One or more categories were not found');
        }

        const roots = categories.filter((category) => category.depth === 0);
        if (roots.length === 0) {
            throw new BadRequestException('At least one root category (depth 0) is required');
        }

        const categorySet = new Set(uniqueCategoryIds);
        const invalidChildren = categories.filter(
            (category) => category.depth > 0 && category.parentId && !categorySet.has(category.parentId),
        );

        if (invalidChildren.length > 0) {
            throw new BadRequestException(
                `Subcategories must include their parent categories: ${invalidChildren
                    .map((c) => c.id)
                    .join(', ')}`,
            );
        }

        await this.prisma.$transaction([
            this.prisma.businessCategory.deleteMany({ where: { businessId } }),
            this.prisma.businessCategory.createMany({
                data: uniqueCategoryIds.map((categoryId) => ({ businessId, categoryId })),
                skipDuplicates: true,
            }),
        ]);
    }

    private async handleBusinessInfoStep(businessId: string, data: any) {
        const dto = await this.validateDto(BusinessInfoStepDataDto, data);
        await this.prisma.business.update({
            where: { id: businessId },
            data: {
                name: dto.name,
                description: dto.description,
                address: dto.address,
                phone: dto.phone,
            },
        });
    }

    private async handleScheduleStep(businessId: string, data: any) {
        const dto = await this.validateDto(ScheduleStepDataDto, data);
        for (const s of dto.schedules) {
            await this.prisma.schedule.upsert({
                where: { businessId_dayOfWeek: { businessId, dayOfWeek: s.dayOfWeek } },
                update: { openTime: s.openTime, closeTime: s.closeTime, isActive: s.isActive },
                create: {
                    dayOfWeek: s.dayOfWeek,
                    openTime: s.openTime,
                    closeTime: s.closeTime,
                    isActive: s.isActive,
                    business: { connect: { id: businessId } },
                },
            });
        }
    }

    private async handleServicesStep(businessId: string, data: any) {
        const dto = await this.validateDto(ServicesStepDataDto, data);
        for (const svc of dto.services) {
            await this.prisma.service.create({
                data: {
                    name: svc.name,
                    description: svc.description,
                    durationMinutes: svc.durationMinutes,
                    price: svc.price ?? null,
                    business: { connect: { id: businessId } },
                },
            });
        }
    }

}
