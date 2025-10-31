import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AuditTrailInterceptor } from './common/interceptors/audit-trail.interceptor';
import { TelemetryService } from './common/telemetry/telemetry.service';

async function bootstrap() {
  const telemetry = new TelemetryService();
  await telemetry.start();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalInterceptors(new AuditTrailInterceptor());

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
