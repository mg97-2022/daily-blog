import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseTransformInterceptor } from './http/interceptors/response-transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import { WinstonLoggerService } from './infrastructure/logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

  // Enable CORS (Cross-Origin Resource Sharing)
  // See (https://github.com/expressjs/cors)
  const corsOrigins = configService.get<string>('app.corsOrigins', '');
  app.enableCors({
    origin: corsOrigins.split(',') || [],
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  // Enabling trust proxy allows you to retrieve the original
  // IP address from the X-Forwarded-For header if behind a proxy (like Nginx or a load balancer).
  // loopback is used to only trust local proxy like Nginx
  app.set('trust proxy', 'loopback');

  // help protect app from some well-known web
  // vulnerabilities by setting HTTP headers appropriately
  // See (https://github.com/helmetjs/helmet)
  app.use(helmet());

  // For high-traffic websites in production,
  // it is strongly recommended to offload compression from the
  // application server - typically in a reverse proxy (e.g., Nginx).
  // In that case, you should not use compression middleware.
  app.use(compression());

  // Handling more complex query parameters,
  // such as nested objects or arrays
  app.set('query parser', 'extended');

  // Set Global prefix for all endpoints
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // For data validation
  app.useGlobalPipes(
    new ValidationPipe({
      // Payloads coming in over the network are plain JavaScript objects.
      // The ValidationPipe can automatically transform payloads to be objects typed according to their DTO classes.
      // Will also perform conversion of primitive types (like path variable to be number based on the type)
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      // exceptionFactory: (errors) => {
      //   console.log(errors);
      // const mappedErrors = errors.reduce((acc, error) => {
      //   const field = error.property;

      //   // Ensure constraints exist before accessing them
      //   if (error.constraints) {
      //     // Take only the first error message if multiple constraints are present
      //     if (!acc[field]) {
      //       acc[field] = Object.values(error.constraints)[0];
      //     }
      //   }

      //   return acc;
      // }, {});

      // return mappedErrors;
      // },
    }),
  );

  // For wrapping the response in object with data key
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Get logger
  const loggerService = app.get(WinstonLoggerService);
  const logger = loggerService.getLogger('bootstrap');

  const port = configService.get<string>('app.port', '3500');
  await app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
}
bootstrap();
