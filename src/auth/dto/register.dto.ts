import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "prisma/generated/enums";

export class RegisterDto{
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    role: Role;



}