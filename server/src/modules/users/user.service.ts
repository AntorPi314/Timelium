import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // User create kora
  async create(data: any): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  // Email diye user khoja (Login er somoy or check kora)
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Username diye user khoja (AuthService er jonno)
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  // All users ber kora
  async findAll(): Promise<User[]> {
    // Find all documents in the User collection
    return this.userModel.find().exec();
  }

  // ID diye single user ber kora
  async findOne(id: string): Promise<User | null> {
    // Find a user by their MongoDB document ID
    return this.userModel.findById(id).exec();
  }
}