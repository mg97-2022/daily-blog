import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendAccountVerificationOtpBodyDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
