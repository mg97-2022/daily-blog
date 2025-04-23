import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OtpType } from 'src/common/enums/otp-type.enum';
import { UserAccountStatus } from 'src/common/enums/user-account-status.enum';
import { UserRole } from 'src/common/enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  passwordChangedAt?: Date;

  @Prop({ enum: UserRole, required: true, default: UserRole.USER })
  role: UserRole;

  @Prop({
    enum: UserAccountStatus,
    required: true,
    default: UserAccountStatus.NOT_VERIFIED,
  })
  status: UserAccountStatus;

  @Prop({ index: true })
  otp?: string;

  @Prop({ enum: OtpType })
  otpType?: OtpType;

  @Prop()
  otpExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
