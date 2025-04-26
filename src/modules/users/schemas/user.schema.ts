import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OtpType } from 'src/common/enums/otp-type.enum';
import { UserAccountStatus } from 'src/common/enums/user-account-status.enum';
import { BaseSchema } from 'src/common/schema/base.schema';
import { UserRole } from 'src/common/enums/user-role.enum';

@Schema()
export class User extends BaseSchema {
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
