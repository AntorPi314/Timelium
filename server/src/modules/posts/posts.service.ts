import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { User } from '../users/schemas/user.schema';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from '../../config/cloudinary.config';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    CloudinaryConfig();
  }

  async create(data: any, userId: string): Promise<Post> {
    const user = await this.userModel.findById(userId);
    let postLocation: string[] = [];

    if (user && user.location) {
      const parts = user.location.split(',').map((s) => s.trim());
      if (parts.length === 2) {
        postLocation = [parts[1], parts[0]];
      } else if (parts.length === 1) {
        postLocation = [parts[0]];
      }
    }

    const newPost = new this.postModel({
      ...data,
      user: userId,
      location: postLocation,
    });
    return newPost.save();
  }

  // [UPDATED] Added query parameter support
  async findAll(currentUserId?: string, query?: string): Promise<Post[]> {
    
    // 1. If there is a Search Query, return filtered results directly (bypassing algorithms)
    if (query) {
        const cleanQuery = query.replace('#', '').trim();
        const regex = new RegExp(cleanQuery, 'i');

        return this.postModel
            .find({ content: regex })
            .populate('user', 'fullname username avatar')
            .sort({ createdAt: -1 })
            .limit(50) // Limit search results
            .exec();
    }

    // 2. Normal Feed Logic (City -> Country -> Popular)
    let cityPosts: Post[] = [];
    let countryPosts: Post[] = [];
    let popularPosts: Post[] = [];

    const TOTAL_BATCH = 20;
    let cityLimit = Math.floor(TOTAL_BATCH * 0.4);
    let countryLimit = Math.floor(TOTAL_BATCH * 0.4);
    let popularLimit = Math.floor(TOTAL_BATCH * 0.2);

    let userCountry = '';
    let userCity = '';

    if (currentUserId) {
      const user = await this.userModel.findById(currentUserId);
      if (user && user.location) {
        const parts = user.location.split(',').map((s) => s.trim());
        if (parts.length >= 2) {
          userCity = parts[0];
          userCountry = parts[1];
        } else if (parts.length === 1) {
          userCountry = parts[0];
        }
      }
    }

    const excludedIds: any[] = [];

    if (userCity && userCountry) {
      cityPosts = await this.postModel
        .find({ location: { $all: [userCountry, userCity] } })
        .sort({ createdAt: -1 })
        .limit(cityLimit)
        .populate('user', 'fullname username avatar')
        .exec();
      cityPosts.forEach((p) => excludedIds.push(p._id));
    }

    if (cityPosts.length < cityLimit) {
      countryLimit += cityLimit - cityPosts.length;
    }

    if (userCountry) {
      countryPosts = await this.postModel
        .find({
          location: { $in: [userCountry] },
          _id: { $nin: excludedIds },
        })
        .sort({ createdAt: -1 })
        .limit(countryLimit)
        .populate('user', 'fullname username avatar')
        .exec();
      countryPosts.forEach((p) => excludedIds.push(p._id));
    }

    if (countryPosts.length < countryLimit) {
      popularLimit += countryLimit - countryPosts.length;
    }

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    popularPosts = await this.postModel
      .find({
        _id: { $nin: excludedIds },
        createdAt: { $gte: lastMonth },
      })
      .sort({ likes: -1, createdAt: -1 })
      .limit(popularLimit)
      .populate('user', 'fullname username avatar')
      .exec();

    return [...cityPosts, ...countryPosts, ...popularPosts];
  }

  async delete(postId: string, userId: string): Promise<any> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.user.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      );
    }
    return this.postModel.findByIdAndDelete(postId);
  }

  async toggleLike(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const likeIndex = post.likes.indexOf(userId as any);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId as any);
    }
    return post.save();
  }

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

  async findByUser(userId: string): Promise<Post[]> {
    return this.postModel
      .find({ user: userId })
      .populate('user', 'fullname username avatar')
      .sort({ createdAt: -1 })
      .exec();
  }
}