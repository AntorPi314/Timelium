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

  @Get()
  async getAllPosts() {
    return this.postsService.findAll();
  }

  @Get('user/:userId')
  async getPostsByUser(@Param('userId') userId: string) {
    return this.postsService.findByUser(userId);
  }
}