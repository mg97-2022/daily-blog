import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginResponseDto } from './dto/login-response.dto';
import { SignupDto } from './dto/signup.dto';
import { HashingService } from 'src/common/services/hashing.service';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserAccountStatus } from 'src/common/enums/user-account-status.enum';
import { OTPService } from 'src/common/services/otp.service';
import { OtpType } from 'src/common/enums/otp-type.enum';
import { DateService } from 'src/common/services/date.service';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly otpService: OTPService,
    private readonly dateService: DateService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    const { password, confirmPassword, ...userData } = signupDto;
    const hashedPassword = await this.hashingService.hash(password);

    await this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      role: UserRole.USER,
      status: UserAccountStatus.NOT_VERIFIED,
      otp: this.otpService.generateOtp(),
      otpType: OtpType.VERIFY_EMAIL,
      otpExpiry: this.dateService.addMinutes(15),
    });

    // Send otp using email in rabbitMQ
  }

  async verifyAccount(otp: string): Promise<void> {
    const user = await this.usersRepository.findByOtp(otp);
    if (!user) {
      throw new BadRequestException('Invalid OTP');
    }
    this.verifyOtpOrFail(user, OtpType.VERIFY_EMAIL);

    user.otp = undefined;
    user.otpType = undefined;
    user.otpExpiry = undefined;
    user.status = UserAccountStatus.VERIFIED;
    await user.save();
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserAccountStatus.VERIFIED) {
      throw new UnauthorizedException('Account not verified');
    }

    const payload = { sub: user._id };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  private verifyOtpOrFail(user: UserDocument, otpType: OtpType): void {
    if (user.otpType !== otpType) {
      throw new BadRequestException('Invalid OTP');
    } else if (!user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestException('OTP expired');
    }
  }
}
