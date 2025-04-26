import { Module } from '@nestjs/common';
import { EnvironmentModule } from './infrastructure/environment.module';
import { DatabaseModule } from './infrastructure/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { RateLimiterModule } from './infrastructure/rate-limiter.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerBehindProxyGuard } from './http/guards/throttler-behind-proxy.guard';
import { CatchAllExceptions } from './http/filters/catch-all-exceptions.filter';
import { WinstonLoggerModule } from './infrastructure/logger/winston-logger.module';
import { UsersModule } from './modules/users/users.module';
import { RedisModule } from './infrastructure/redis/redis.module';

@Module({
  imports: [
    WinstonLoggerModule,
    EnvironmentModule,
    RateLimiterModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    RedisModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CatchAllExceptions,
    },
  ],
})
export class AppModule {}
