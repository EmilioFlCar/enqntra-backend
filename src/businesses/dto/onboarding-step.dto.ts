import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Matches, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OnboardingStep } from 'prisma/generated/enums';

// --- Wrapper DTO ---

export class OnboardingStepDto {
    @IsEnum(OnboardingStep)
    step: OnboardingStep;

    @IsNotEmpty()
    data: any;
}

// --- Per-step data DTOs ---

export class CategoryStepDataDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsUUID('4', { each: true })
    categoryIds: string[];
}

export class BusinessInfoStepDataDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}

export class ScheduleItemDto {
    @IsInt()
    @Min(0)
    @Max(6)
    dayOfWeek: number;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    openTime: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    closeTime: string;

    @IsBoolean()
    isActive: boolean;
}

export class ScheduleStepDataDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ScheduleItemDto)
    schedules: ScheduleItemDto[];
}

export class ServiceItemDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsPositive()
    durationMinutes: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
}

export class ServicesStepDataDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ServiceItemDto)
    services: ServiceItemDto[];
}

