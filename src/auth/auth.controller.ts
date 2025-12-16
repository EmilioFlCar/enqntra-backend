import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { LocalAuthGuard } from './guards/local-auth.guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Public()
    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any){
        return this.authService.login(req.user);
    }

}

