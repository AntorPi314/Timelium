import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly apiKey: string;

  constructor(
    private configService: ConfigService,
    private postsService: PostsService,
  ) {
    this.apiKey = this.configService.get<string>('GOOGLE_API_KEY')!;
    if (!this.apiKey) {
      throw new Error('GOOGLE_API_KEY is not defined in environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      // 1. Fetch posts context
      const posts = await this.postsService.findAll();
      const feedContext = posts.slice(0, 15).map((p: any) => {
        return `
        - Post by: ${p.user?.fullname || 'Unknown'} (@${p.user?.username})
        - Content: "${p.content}"
        - Likes: ${p.likes?.length || 0}
        - Time: ${new Date(p.createdAt).toLocaleString()}
        `;
      }).join('\n');

      const systemPrompt = `
You are Timelium AI, a helpful assistant for the Timelium social platform.

Current Live Feed Context:
${feedContext}

Instructions:
- Answer user questions based on the feed content provided above
- If the question is about posts, users, or platform activity, use the feed data
- If the question is general or not related to the feed, provide helpful answers
- Be friendly, concise, and professional
- Format your responses clearly

User Question: ${prompt}
`;

      // 2. Use gemini-pro (stable model that works with v1beta)
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash"
      });

      // 3. Generate content
      const result = await model.generateContent(systemPrompt);
      
      if (!result || !result.response) {
        throw new Error("No response from Gemini API");
      }

      const response = result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Gemini");
      }

      return text;

    } catch (error: any) {
      console.error("=== Gemini API Error Details ===");
      console.error("Error Message:", error.message);
      console.error("Error Name:", error.name);
      
      // Handle specific error types
      if (error.message?.includes('API key')) {
        return "AI Service Error: Invalid API key. Please check your Google AI configuration.";
      }
      
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        return "AI Service Error: API quota exceeded. Please try again later.";
      }
      
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        return "AI Service Error: The requested AI model is not available. Using alternative model...";
      }

      if (error.message?.includes('SAFETY')) {
        return "I apologize, but I cannot process this request due to content safety guidelines. Please rephrase your question.";
      }

      // Generic error with helpful message
      return `I'm having trouble processing your request right now. Please try again in a moment. (Error: ${error.message?.substring(0, 100)})`;
    }
  }
}
