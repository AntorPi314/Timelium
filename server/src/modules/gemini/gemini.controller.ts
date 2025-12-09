import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express'; 
import { GeminiService } from './gemini.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';


interface AuthRequest extends Request {
  user: {
    userId: string;
    username: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('chat')
  async chat(@Body() chatRequestDto: ChatRequestDto, @Req() req: AuthRequest) {

    console.log(`User ${req.user.username || req.user.userId} accessed Timelium AI.`);

    const responseText = await this.geminiService.generateContent(
      chatRequestDto.prompt,
    );

    return { text: responseText };
  }
}