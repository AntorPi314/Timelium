import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from '../../config/cloudinary.config';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    CloudinaryConfig();
  }

  async create(data: any): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateProfile(username: string, data: any): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ username }, data, { new: true })
      .exec();
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'timelium_profiles' },
        (error, result) => {
          if (error || !result)
            return reject(error || new Error('Failed to upload image'));
          resolve(result.secure_url);
        },
      );

      const toStream = (buffer: Buffer) => {
        const { Readable } = require('stream');
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
      };

      toStream(file.buffer).pipe(upload);
    });
  }

  // ADD SKILL
  async addSkill(username: string, skill: string): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate(
        { username },
        { $addToSet: { skills: skill } }, // Prevents duplicates
        { new: true },
      )
      .exec();
  }

  // ADD PROJECT
  async addProject(username: string, project: any): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate(
        { username },
        { $push: { projects: project } },
        { new: true },
      )
      .exec();
  }

  // ADD EXPERIENCE
  async addExperience(username: string, experience: any): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate(
        { username },
        { $push: { experience: experience } },
        { new: true },
      )
      .exec();
  }

  // ADD EDUCATION
  async addEducation(username: string, education: any): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate(
        { username },
        { $push: { education: education } },
        { new: true },
      )
      .exec();
  }
}
