import { IsUUID } from "class-validator";

export class GetAvailabilityDto {
    @IsUUID()
    businessId: string;
    @IsUUID()
    serviceId: string;
    
    date: string; // "YYYY-MM-DD" format    
}