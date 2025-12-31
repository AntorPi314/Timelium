import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // REGISTER LOGIC
  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    // Create User
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });
    // Return token directly after register
    return this.generateToken(user);
  }

  // LOGIN LOGIC
  async login(loginDto: LoginDto) {
    // User khojo (Email ba Username diye)
    let user = await this.userService.findByEmail(loginDto.emailOrUser);
    if (!user) {
      user = await this.userService.findByUsername(loginDto.emailOrUser);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Password match koro
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  // TOKEN GENERATOR
  private generateToken(user: any) {
    const payload = { sub: user._id, email: user.email, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        avatar: user.avatar //  Added Avatar here
      }
    };
  }
}