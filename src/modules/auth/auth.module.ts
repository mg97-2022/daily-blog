import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { HashingService } from 'src/common/services/hashing.service';
import { OTPService } from 'src/common/services/otp.service';
import { DateService } from 'src/common/services/date.service';
import { JWTModule } from 'src/infrastructure/jwt.module';

@Module({
  imports: [UsersModule, JWTModule],
  controllers: [AuthController],
  providers: [AuthService, HashingService, OTPService, DateService],
})
export class AuthModule {}
