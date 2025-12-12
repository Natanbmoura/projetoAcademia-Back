import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET', 'secret'),
    });
  }

  validate(payload: { sub: string; email: string; role?: string }) {
    // Se tiver role 'member', retornar memberId, senão instructorId
    if (payload.role === 'member') {
      return { memberId: payload.sub, email: payload.email, role: 'member' };
    }
    return { instructorId: payload.sub, email: payload.email, role: 'instructor' };
  }
}


