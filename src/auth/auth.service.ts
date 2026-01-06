import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwtService: JwtService
    ) {}

    async register(dto: RegisterDto){
        const user = await this.prisma.user.findUnique({
            where: {email: dto.email}
        });
        if(user){
            throw new BadRequestException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newUser = await this.prisma.user.create({
            data:{
                email: dto.email,
                name: dto.name,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        return newUser;
    }

    async login(user: any){
        const payload = {id: user.id, email: user.email, role: user.role};
        return{
            access_token: this.jwtService.sign(payload),
            user: user
        }
    }

    async validateUser(email: string, password: string){
        const user = await this.prisma.user.findUnique({
            where: {email: email}
        });
        if(!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return null;
        
        return user;
    }


} 