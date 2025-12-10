import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChatRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Prompt must greater than 5 character' }) 
  prompt: string;
}