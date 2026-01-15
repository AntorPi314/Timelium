import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Req() req: any) {
    return this.postsService.delete(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Req() req: any,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await this.postsService.uploadImage(file);
    }
    const postData = {
      content: body.content,
      image: imageUrl,
    };
    return this.postsService.create(postData, req.user.userId);
  }

  // [UPDATED] Get Feed (Guest/Generic) with Search Support
  @Get()
  async getAllPosts(@Req() req: any, @Query('q') query?: string) {
    // If user is logged in via headers but hitting this endpoint, we try to pass ID
    let userId = undefined;
    if (req.headers.authorization) {
       // Logic handled in service if needed, or rely on 'feed' endpoint for logged in users
    }
    // Pass query to service
    return this.postsService.findAll(undefined, query);
  }
  
  // [UPDATED] Get Personalized Feed with Search Support
  @UseGuards(JwtAuthGuard)
  @Get('feed')
  async getPersonalizedFeed(@Req() req: any, @Query('q') query?: string) {
      return this.postsService.findAll(req.user.userId, query);
  }

  @Get('user/:userId')
  async getPostsByUser(@Param('userId') userId: string) {
    return this.postsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Req() req: any) {
    return this.postsService.toggleLike(id, req.user.userId);
  }
}