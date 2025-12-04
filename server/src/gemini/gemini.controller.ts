// gemini/gemini.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('chat')
  async chat(@Body() body: { message: string }) {
    try {
      const response = await this.geminiService.generateResponse(body.message);
      return { response };
    } catch (error) {
      return { 
        response: 'Sorry, I encountered an error. Please try again.',
        error: error.message 
      };
    }
  }
}