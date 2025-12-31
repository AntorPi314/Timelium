import { Module } from '@nestjs/common';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';
import { ConfigModule } from '@nestjs/config'; // ConfigModule import kora holo

@Module({
  imports: [ConfigModule], // environment variables
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class GeminiModule {}