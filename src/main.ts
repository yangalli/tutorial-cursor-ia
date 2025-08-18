import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração de CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Configuração de validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Patrimônio - Nova Acrópole')
    .setDescription('API para gestão de patrimônio e inventário da Nova Acrópole')
    .setVersion('1.0')
    .addTag('Escolas', 'Endpoints para gestão de escolas')
    .addTag('Usuários', 'Endpoints para gestão de usuários')
    .addTag('Patrimônio', 'Endpoints para gestão de patrimônio')
    .addTag('Inventário', 'Endpoints para gestão de inventário')
    .addTag('Categorias', 'Endpoints para gestão de categorias')
    .addTag('Documentos', 'Endpoints para gestão de documentos')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Configuração de prefixo global
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Aplicação rodando na porta ${port}`);
  console.log(`📚 Documentação Swagger disponível em: http://localhost:${port}/api`);
}

bootstrap();
