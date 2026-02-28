import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { PrismaService } from '../prisma.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';
import { OnboardingStep, Role } from 'prisma/generated/enums';

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
            app_metadata: { role: Role.BUSINESS },
        });

        if (error) {
            throw new BadRequestException(error.message);
        }

        const { user } = await this.prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
                data: {
                    id: data.user.id,
                    email: data.user.email!,
                    name: dto.name,
                    role: Role.BUSINESS,
                },
            });

            await tx.business.create({
                data: {
                    onboardingStep: OnboardingStep.NOT_STARTED,
                    owner: { connect: { id: createdUser.id } },
                },
            });

            return { user: createdUser };
        });

        return { success: true };
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

        const user = await this.prisma.user.findUnique({
            where: { id: data.user.id },
        });

        if (!user) {
            throw new BadRequestException('User not found in internal database');
        }

        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user,
        };
    }

    async me(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                businesses: {
                    select: {
                        id: true,
                        onboardingStep: true,
                        onboardingCompletedAt: true,
                    },
                },
            },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return user;
    }
}