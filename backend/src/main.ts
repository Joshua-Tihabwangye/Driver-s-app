import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/api/http-exception.filter';
import { ApiResponseService } from './common/api/api-response.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const apiResponse = app.get(ApiResponseService);
  app.useGlobalFilters(new HttpExceptionFilter(apiResponse));

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`EVzone backend listening on http://localhost:${port}/api/v1`);
}

bootstrap();
