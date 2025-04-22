import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from 'src/config/app.config';
import { databaseConfig } from 'src/config/database.config';
import * as Joi from 'joi';
import { Environments } from 'src/common/enums/environment.enum';

const envFilePath = `env/.env.${process.env.NODE_ENV}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [databaseConfig, appConfig],
      validationSchema: Joi.object({
        // app
        PORT: Joi.number().required(),
        NODE_ENV: Joi.string()
          .valid(Environments.DEVELOPMENT)
          .default(Environments.DEVELOPMENT),
        CORS_ORIGINS: Joi.string().required(),
        // database
        MONGO_URI: Joi.string().required(),
        MONGO_DB_NAME: Joi.string().required(),
      }),
    }),
  ],
})
export class EnvironmentModule {}
