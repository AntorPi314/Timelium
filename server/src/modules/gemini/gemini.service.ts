// src\modules\gemini\gemini.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;
  private readonly apiKey: string;
  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_API_KEY')!;

    if (!this.apiKey) {
      throw new Error('GOOGLE_API_KEY is not defined in environment variables.');
    }

    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async generateContent(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text ?? 'AI response was empty or blocked.'; 
  }
}