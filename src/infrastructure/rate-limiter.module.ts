import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hours, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        errorMessage:
          'Too many requests from this IP, please try again in an hour!',
        skipIf: () => configService.get<boolean>('app.isDevelopment', false),
        throttlers: [
          {
            ttl: hours(1),
            limit: 1000,
            blockDuration: hours(1),
          },
        ],
      }),
    }),
  ],
})
export class RateLimiterModule {}
