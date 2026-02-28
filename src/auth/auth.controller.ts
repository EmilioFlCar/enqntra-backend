import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { UserPayload } from '../common/types/user-payload.js';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Public()
    @Post('login')
    async login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @Get('me')
    async me(@CurrentUser() user: UserPayload) {
        return this.authService.me(user.id);
    }
}

