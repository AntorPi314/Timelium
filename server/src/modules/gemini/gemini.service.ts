import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;
  private readonly apiKey: string;

  constructor(
    private configService: ConfigService,
    private postsService: PostsService,
  ) {
    this.apiKey = this.configService.get<string>('GOOGLE_API_KEY')!;
    if (!this.apiKey) {
      throw new Error('GOOGLE_API_KEY is not defined in environment variables.');
    }
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async generateContent(prompt: string): Promise<string> {
    const posts = await this.postsService.findAll();
    const feedContext = posts.slice(0, 15).map((p: any) => {
      return `
      - Post by: ${p.user?.fullname || 'Unknown'} (@${p.user?.username})
      - Content: "${p.content}"
      - Likes: ${p.likes?.length || 0}
      - Time: ${new Date(p.createdAt).toLocaleString()}
      `;
    }).join('\n');
    const systemInstruction = `
    You are Timelium AI. You have access to the current live feed of the website.
    
    Current Feed Context (What the user sees on screen):
    ${feedContext}

    Instructions:
    - If the user asks about a post, use the "Current Feed Context" to answer.
    - You can tell who posted what, how many likes it has, and when it was posted.
    - If the answer is not in the feed, politely say you don't see that info on the feed.
    - Be helpful and friendly.

    User Question: ${prompt}
    `;
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemInstruction,
    });

    return response.text ?? 'I could not generate a response.'; 
  }
}