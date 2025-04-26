import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { Match } from 'src/common/validators/match.validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
