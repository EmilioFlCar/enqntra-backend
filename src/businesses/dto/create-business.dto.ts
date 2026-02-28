import { IsString, IsUUID } from "class-validator";

export class CreateBusinessDto {
    @IsString()
    name: string;

    @IsString()
    description?: string;

    @IsString()
    address?: string;

    @IsString()
    phone?: string;
}