import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { create } from 'domain';

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

    async login(dto: {email: string; password: string;}){
        const user = await this.prisma.user.findUnique({
            where: {email: dto.email}
        });
        if(!user){
            throw new BadRequestException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if(!isPasswordValid){
            throw new BadRequestException('Invalid credentials');
        }
        const payload = {sub: user.id, email: user.email, role: user.role};
        const token = await this.jwtService.signAsync(payload);

        return{
            token,
            user:{
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        }
    }


} 