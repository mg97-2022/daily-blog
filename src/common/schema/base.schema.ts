import { Prop, Schema } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}
