import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repository/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }

  findByOtp(otp: string): Promise<UserDocument | null> {
    return this.findOne({ otp });
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email });
  }
}
