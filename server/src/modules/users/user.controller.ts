import { Controller, Get, Post, Body, Param, Put, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'; // পাথ ঠিক করে নিন

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: any) {
    return this.userService.create(createUserDto);
  }
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
  @Get(':username')
  async findOne(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/update')
  async updateProfile(@Req() req: any, @Body() data: any) {
    const username = req.user.username; 
    return this.userService.updateProfile(username, data);
  }

  
  @UseGuards(JwtAuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.userService.uploadImage(file);
    return { url: imageUrl };
  }
}