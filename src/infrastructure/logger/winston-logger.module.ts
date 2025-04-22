import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from 'src/infrastructure/logger/winston-logger.service';

@Global()
@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class WinstonLoggerModule {}
