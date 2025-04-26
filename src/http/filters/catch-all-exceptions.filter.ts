import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Error as MongooseGenericError } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { WinstonLoggerService } from '../../infrastructure/logger/winston-logger.service';
import { Logger } from 'winston';

type ResponseBody = {
  statusCode: HttpStatus;
  message: string;
  error?: any;
  stack?: any;
};

@Catch()
export class CatchAllExceptions implements ExceptionFilter {
  private logger: Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly winstonLogger: WinstonLoggerService,
  ) {
    this.logger = this.winstonLogger.getLogger('error');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = this.getStatusCode(exception);
    const message = this.getErrorMessage(exception);

    const isDevelopment = this.configService.get<boolean>(
      'app.isDevelopment',
      false,
    );

    const resBody: ResponseBody = isDevelopment
      ? this.handleDevelopmentResponse({ statusCode, message, exception })
      : this.handleProductionResponse({ statusCode, message });

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Error occurred: ${message}`, {
        meta: {
          exception,
          stack: exception instanceof Error ? exception.stack : undefined,
        },
      });
    }

    response.status(statusCode).json(resBody);
  }

  private handleDevelopmentResponse({
    statusCode,
    message,
    exception,
  }: {
    statusCode: HttpStatus;
    message: string;
    exception: any;
  }): ResponseBody {
    return {
      message,
      statusCode,
      error: exception.name,
      stack: exception.stack,
    };
  }

  private handleProductionResponse({
    statusCode,
    message,
  }: {
    statusCode: HttpStatus;
    message: string;
  }): ResponseBody {
    return {
      statusCode,
      message,
    };
  }
  private getStatusCode(exception: unknown): number {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    } else if (exception instanceof MongoServerError) {
      if (this.isMongoDuplicateError(exception)) {
        statusCode = HttpStatus.CONFLICT;
      }
    } else if (exception instanceof MongooseGenericError) {
      statusCode = HttpStatus.BAD_REQUEST;
    }

    return statusCode;
  }

  private getErrorMessage(exception: unknown): string {
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any)?.message;
    } else if (exception instanceof MongoServerError) {
      if (this.isMongoDuplicateError(exception)) {
        message = this.handleDuplicateErrorMessage(exception.keyValue);
      }
    } else if (exception instanceof MongooseGenericError) {
      message = exception.message;
    }

    return message;
  }

  private isMongoDuplicateError(e: any): e is MongoServerError {
    return e?.code === 11000;
  }

  private handleDuplicateErrorMessage(keyValue: Record<string, any>): string {
    const [key, value] = Object.entries(keyValue)[0] || [];
    return key
      ? `Duplicate key (${key}${value ? `: ${value}` : ''})`
      : 'Duplicate key error';
  }
}
