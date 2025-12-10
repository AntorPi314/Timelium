import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: null })
  title: string;

  @Prop({ default: null })
  location: string;

  @Prop({ default: null })
  about: string;

  @Prop({ type: Object, default: { linkedin: null, youtube: null, github: null, facebook: null } })
  links: {
    linkedin: string | null;
    youtube: string | null;
    github: string | null;
    facebook: string | null;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);