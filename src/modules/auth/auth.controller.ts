import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login-body.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { minutes, Throttle } from '@nestjs/throttler';
import { ForgotPasswordBodyDto } from './dto/forgot-password-body.dto';
import { ResendAccountVerificationOtpBodyDto } from './dto/resend-account-verification-otp-body.dto';
import { ResetPasswordDto } from './dto/reset-password-body.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto): Promise<void> {
    await this.authService.signup(signupDto);
  }

  @Patch('verify-account')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyAccount(
    @Body() verifyAccountDto: VerifyAccountDto,
  ): Promise<void> {
    await this.authService.verifyAccount(verifyAccountDto.otp);
  }

  @Post('resend-account-verification-otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendAccountVerificationOtp(
    @Body() resendAccountVerificationDto: ResendAccountVerificationOtpBodyDto,
  ): Promise<void> {
    await this.authService.resendAccountVerificationOtp(
      resendAccountVerificationDto.email,
    );
  }

  @Throttle({
    default: { limit: 5, ttl: minutes(1) },
  })
  @Post('login')
  async login(@Body() loginDto: LoginBodyDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Throttle({
    default: { limit: 2, ttl: minutes(1) },
  })
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordBodyDto,
  ): Promise<void> {
    await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Patch('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(
      resetPasswordDto.otp,
      resetPasswordDto.password,
    );
  }
}
