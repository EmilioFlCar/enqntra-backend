import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { PrismaService } from '../prisma.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private supabaseService: SupabaseService,
    ) {}

    async register(dto: RegisterDto) {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase.auth.admin.createUser({
            email: dto.email,
            password: dto.password,
            email_confirm: true,
            user_metadata: { name: dto.name },
            app_metadata: { role: 'USER' },
        });

        if (error) {
            throw new BadRequestException(error.message);
        }

        const user = await this.prisma.user.create({
            data: {
                id: data.user.id,
                email: data.user.email!,
                name: dto.name,
                role: 'USER',
            },
        });

        return { id: user.id, email: user.email, name: user.name, role: user.role };
    }

    async login(dto: { email: string; password: string }) {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: dto.email,
            password: dto.password,
        });

        if (error) {
            throw new BadRequestException(error.message);
        }

        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: {
                id: data.user.id,
                email: data.user.email,
            },
        };
    }
} 