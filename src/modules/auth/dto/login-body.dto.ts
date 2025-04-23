import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginBodyDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
