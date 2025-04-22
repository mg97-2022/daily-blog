import { registerAs } from '@nestjs/config';
import { Environments } from 'src/common/enums/environment.enum';

export const appConfig = registerAs('app', () => ({
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === Environments.DEVELOPMENT,
  corsOrigins: process.env.CORS_ORIGINS,
}));
