import { IsDate, IsString } from "class-validator";

export class CreateAppointmentDto {
    
    @IsString()
    serviceId: string;
    
    @IsString()
    businessId: string;
    
    @IsDate()
    date: Date;
}