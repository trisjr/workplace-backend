import { UserRepositoryPort } from '@modules/user/database/user.repository.port';
import { UserNotFoundError } from '@modules/user/domain/user.errors';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/services/api-config.service';
import { TokenResponse } from '@libs/api/token.response.dto';
import { TokenType } from '@libs/constants';
import { Err, Ok, Result } from 'oxide.ts';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { LoginUserCommand } from './login-user.command';

@CommandHandler(LoginUserCommand)
export class LoginUserService implements ICommandHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
    private jwtService: JwtService,
    private configService: ApiConfigService,
  ) {}

  async execute({ email, password }: LoginUserCommand): Promise<Result<TokenResponse, UserNotFoundError>> {
    const user = await this.userRepo.findOneByEmail(email);
    if (!user) {
      return Err(new UserNotFoundError());
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return Err(new UserNotFoundError());
    }

    const response = new TokenResponse({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: user.id,
        type: TokenType.ACCESS_TOKEN,
        role: user.role,
      }),
    });

    return Ok(response);
  }
}
