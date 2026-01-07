import { Module } from '@nestjs/common';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from '../posts/posts.module'; // [Change]: Importing PostsModule

@Module({
  imports: [ConfigModule, PostsModule], // [Change]: Added PostsModule
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class GeminiModule {}