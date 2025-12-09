// src/modules/auth/strategy/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/user.service'; // Assuming path

// Payload interface as defined in auth.service.ts generateToken() [cite: 40]
interface JwtPayload {
  sub: string;
  email: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UserService, // To check if the user still exists
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey123',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }
    

    return { 
        userId: payload.sub, 
        username: payload.username, 
        email: payload.email 
    };
  }
}