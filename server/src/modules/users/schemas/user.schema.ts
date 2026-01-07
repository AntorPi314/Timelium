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

  // NEW: Hire Me / Contact Info
  @Prop({ 
    type: Object, 
    default: { whatsapp: null, messenger: null, telegram: null, contactEmail: null } 
  })
  hireMe: {
    whatsapp: string | null;
    messenger: string | null;
    telegram: string | null;
    contactEmail: string | null;
  };

  // Skills Array
  @Prop({ type: [String], default: [] })
  skills: string[];

  // Projects Array
  @Prop({
    type: [
      {
        title: String,
        description: String,
        technologies: [String],
        link: String,
        image: String,
      },
    ],
    default: [],
  })
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    image?: string;
  }>;

  // Experience Array
  @Prop({
    type: [
      {
        company: String,
        position: String,
        duration: String,
        description: String,
      },
    ],
    default: [],
  })
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;

  // Education Array
  @Prop({
    type: [
      {
        institution: String,
        degree: String,
        field: String,
        year: String,
      },
    ],
    default: [],
  })
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);