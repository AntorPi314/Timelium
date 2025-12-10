import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from '../../config/cloudinary.config';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {
    CloudinaryConfig();
  }

  // Create Post
  async create(data: any, userId: string): Promise<Post> {
    const newPost = new this.postModel({
      ...data,
      user: userId,
    });
    return newPost.save();
  }

  async delete(postId: string, userId: string): Promise<any> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.toString() !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this post');
    }

    return this.postModel.findByIdAndDelete(postId);
  }

  // Image Upload Helper
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'timelium_posts' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Image upload failed'));

          resolve(result.secure_url);
        },
      );

      const { Readable } = require('stream');
      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(upload);
    });
  }

  // Get All Posts
  async findAll(): Promise<Post[]> {
    return this.postModel
      .find()
      .populate('user', 'fullname username avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Find posts by specific user
  async findByUser(userId: string): Promise<Post[]> {
    return this.postModel
      .find({ user: userId })
      .populate('user', 'fullname username avatar')
      .sort({ createdAt: -1 })
      .exec();
  }
}