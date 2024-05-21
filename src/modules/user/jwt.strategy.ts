import { RoleType, TokenType } from '@libs/constants';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ApiConfigService } from '@shared/services/api-config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepositoryPort } from './database/user.repository.port';
import { UserEntity } from './domain/user.entity';
import { USER_REPOSITORY } from './user.di-tokens';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ApiConfigService,
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.secret,
    });
  }

  async validate(args: { userId: string; role: RoleType; type: TokenType }): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepo.findOneByIdAndRole(args.userId, args.role);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
