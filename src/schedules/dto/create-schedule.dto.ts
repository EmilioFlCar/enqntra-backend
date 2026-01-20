import { IsBoolean, IsInt, IsString, IsUUID, Matches, Max, Min } from "class-validator";

export class CreateScheduleDto {
    @IsInt()
    @Min(0)
    @Max(6)
    dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)   
    openTime: string; // "HH:MM" format

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)  
    closeTime: string;   // "HH:MM" format

    @IsBoolean()
    isActive: boolean;

    @IsUUID()
    businessId: string;
}