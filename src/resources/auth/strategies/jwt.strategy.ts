import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/resources/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);

  constructor(
    configService: ConfigService,
    private usersService: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    this.logger.log('JWT Payload: ' + JSON.stringify(payload));

    const user = await this.usersService.findByIdentifier(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    this.logger.log('Found User: ' + JSON.stringify(user));

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }
}