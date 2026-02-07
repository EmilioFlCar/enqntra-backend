import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private supabaseService: SupabaseService,
        private prisma: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid authorization header');
        }

        const token = authHeader.replace('Bearer ', '');
        const supabaseUser = await this.supabaseService.getUser(token);

        if (!supabaseUser) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        // Lazy sync: upsert user in local DB
        const role = supabaseUser.app_metadata?.role ?? 'USER';
        const name = supabaseUser.user_metadata?.name ?? '';

        let user = await this.prisma.user.findUnique({
            where: { id: supabaseUser.id },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    id: supabaseUser.id,
                    email: supabaseUser.email!,
                    name,
                    role,
                },
            });
        }

        request.user = { id: user.id, email: user.email, role: user.role };

        return true;
    }
}
