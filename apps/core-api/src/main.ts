import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PinoLoggerService } from './common/logger/logger.service';
import { PinoHttpInterceptor } from './common/logger/pino-http.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new PinoLoggerService(),
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Global logging interceptor
  const loggerService = app.get(PinoLoggerService);
  app.useGlobalInterceptors(new PinoHttpInterceptor(loggerService));

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/healthz`);
  console.log(`📈 Metrics: http://localhost:${port}/metrics`);
  console.log(`🔍 GraphQL Playground: http://localhost:${port}/graphql`);
}

bootstrap();