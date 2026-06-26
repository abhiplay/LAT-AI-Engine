import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET') ?? 'lat-secret-key',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub, email: payload.email, role: payload.role,
      name: payload.name, regionId: payload.regionId, schoolId: payload.schoolId,
      gradeId: payload.gradeId, gradeName: payload.gradeName, rollId: payload.rollId,
    };
  }
}
