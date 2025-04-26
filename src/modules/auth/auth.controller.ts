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

  @Throttle({
    default: { limit: 5, ttl: minutes(1) },
  })
  @Post('login')
  async login(@Body() loginDto: LoginBodyDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
