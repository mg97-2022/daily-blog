import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

  signup() {}

  login(email: string, password: string) {
    // 1) get the user by email

    // 2) check if the password is correct

    // 3) check if the user account status is valid

    // 4) generate the user JWT

    // 5) send the session as response
  }
}
