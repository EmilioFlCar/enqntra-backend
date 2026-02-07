import { Type } from "class-transformer";
import { IsDate, IsEmail, IsString, IsUUID } from "class-validator";

export class CreatePublicAppointmentDto {
    
    @IsUUID()
    serviceId: string;
    
    @IsUUID()
    businessId: string;

    @IsString()
    clientName: string;

    @IsString()
    clientPhone: string;

    @IsString()
    @IsEmail()
    clientEmail: string;
    
    @IsDate()
    @Type(() => Date)
    startAt: Date;

    
}