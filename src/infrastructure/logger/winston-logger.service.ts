import * as winston from 'winston';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environments } from '../../common/enums/environment.enum';

const { combine, timestamp, printf } = winston.format;

type MyFormatType = {
  level: string;
  message: string;
  timestamp: string;
  [key: string]: any;
};

@Injectable()
export class WinstonLoggerService {
  constructor(private readonly configService: ConfigService) {}

  private readonly myFormat = printf(
    ({ level, message, timestamp, ...info }: MyFormatType): string => {
      let logMessage = `${timestamp} | ${level.toUpperCase()} | ${message}`;
      const meta = info?.meta;
      if (meta) {
        const stringifiedMeta = JSON.stringify(meta);
        logMessage += ` | ${stringifiedMeta}`;
      }
      return logMessage;
    },
  );

  getLogger(loggerName: string): winston.Logger {
    const environment = this.configService.get<Environments>(
      'app.environment',
      Environments.DEVELOPMENT,
    );
    const isDevelopment = this.configService.get<boolean>(
      'app.isDevelopment',
      false,
    );

    return winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.File({
          format: combine(timestamp(), this.myFormat),
          dirname: `./logs/${environment}`,
          filename: `${loggerName}.log`,
        }),
        ...(isDevelopment
          ? [
              new winston.transports.Console({
                format: combine(timestamp(), this.myFormat),
              }),
            ]
          : []),
      ],
    });
  }
}
