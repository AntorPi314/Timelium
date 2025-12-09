import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  fullname: string;

  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  emailOrUser: string; // Email othoba Username diye login kora jabe

  @IsNotEmpty()
  password: string;
}