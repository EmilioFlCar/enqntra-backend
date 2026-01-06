import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateBusinessServiceDto {
        @IsString()
        name: string;

        @IsString()
        @IsOptional()
        description?: string

        @IsInt()
        @IsPositive()
        durationMin: number;

        @IsNumber()
        @IsPositive()
        price: number | null;
    }