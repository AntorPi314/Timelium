import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

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

  // NEW: Search Endpoint (Place this BEFORE :username)
  @Get('search')
  async search(@Query('q') query: string) {
    return this.userService.searchUsers(query);
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

  @UseGuards(JwtAuthGuard)
  @Post('skills')
  async addSkill(@Req() req: any, @Body() data: { skill: string }) {
    const username = req.user.username;
    return this.userService.addSkill(username, data.skill);
  }

  @UseGuards(JwtAuthGuard)
  @Post('projects')
  async addProject(@Req() req: any, @Body() data: any) {
    const username = req.user.username;
    return this.userService.addProject(username, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('experience')
  async addExperience(@Req() req: any, @Body() data: any) {
    const username = req.user.username;
    return this.userService.addExperience(username, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('education')
  async addEducation(@Req() req: any, @Body() data: any) {
    const username = req.user.username;
    return this.userService.addEducation(username, data);
  }
}