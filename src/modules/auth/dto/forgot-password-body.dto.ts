import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordBodyDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
