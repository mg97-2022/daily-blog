import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAccountDto {
  @IsNotEmpty()
  @IsString()
  otp: string;
}
