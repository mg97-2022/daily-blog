import { Injectable } from '@nestjs/common';

@Injectable()
export class OTPService {
  generateOtp(): string {
    const charset = '0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    return '123456';
  }
}
