import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './modules/common/filters/http-exception.filter';
import { LoggingInterceptor } from './modules/common/interceptors/logging.interceptor';
import { ResponseTransformInterceptor } from './modules/common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.ALL }],
  });

  console.log('Global prefix excluded: /');
  console.log('Global prefix excluded: health');

  // Enable CORS
  const corsOriginEnv = process.env.CORS_ORIGIN;
  const allowedOrigins = corsOriginEnv
    ? corsOriginEnv
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : ['http://localhost:3000'];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  console.log('CORS enabled for origins:', allowedOrigins);

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new ResponseTransformInterceptor(), // Transform all responses to standard format
    new LoggingInterceptor(), // Log all requests and responses
  );

  console.log('Global exception filter enabled');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  console.log('Global validation pipe enabled');

  console.log('Swagger documentation enabled');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Vinh Xuan CMS API')
    .setDescription('API documentation for Vinh Xuan Notary CMS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  console.log('Swagger documentation setup complete');

  const port = process.env.PORT || 8830;

  console.log('Starting application on port:', port);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
