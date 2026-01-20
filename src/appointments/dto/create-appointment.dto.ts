import { Type } from "class-transformer";
import { IsDate, IsUUID } from "class-validator";

export class CreateAppointmentDto {
    
    @IsUUID()
    serviceId: string;
    
    @IsUUID()
    businessId: string;
    
    @IsDate()
    @Type(() => Date)
    startAt: Date;
    
}