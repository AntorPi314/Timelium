import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChatRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Prompt অবশ্যই ৫ অক্ষরের বেশি হতে হবে।' }) // Prompt validation
  prompt: string;
}