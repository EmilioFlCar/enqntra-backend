import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Enqntra API')
    .setDescription('API for Enqntra')
    .setVersion('1.0')
    .build();
  
  const documentFactory = ()=> SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory());

  Logger: ['error', 'warn', 'log']
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthGuard(Reflector.prototype));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
