import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Logger: ['error', 'warn', 'log']
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthGuard(Reflector.prototype));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
