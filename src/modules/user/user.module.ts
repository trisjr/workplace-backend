import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiConfigService } from '@shared/services/api-config.service';
import { CreateUserCliController } from './commands/create-user/create-user.cli.controller';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { CreateUserMessageController } from './commands/create-user/create-user.message.controller';
import { CreateUserService } from './commands/create-user/create-user.service';
import { DeleteUserHttpController } from './commands/delete-user/delete-user.http-controller';
import { DeleteUserService } from './commands/delete-user/delete-user.service';
import { LoginUserHttpController } from './commands/login-user/login-user.http.controller';
import { LoginUserService } from './commands/login-user/login-user.service';
import { UserRepository } from './database/user.repository';
import { SystemLogWhenUserIsCreatedEventHandler } from './event-handlers/user-created/system-log-when-user-is-created.event-handler';
import { JwtStrategy } from './jwt.strategy';
import { PublicStrategy } from './public.strategy';
import { FindUsersHttpController } from './queries/find-users/find-users.http.controller';
import { FindUsersQueryHandler } from './queries/find-users/find-users.query-handler';
import { UserDetailsHttpController } from './queries/get-user/get-user.http.controller';
import { CallNewCommandWhenUserIsCreatedSaga } from './sagas/user-created/call-new-command-when-user-is-created.saga';
import { USER_REPOSITORY } from './user.di-tokens';
import { UserMapper } from './user.mapper';

const httpControllers = [
  CreateUserHttpController,
  DeleteUserHttpController,
  FindUsersHttpController,
  LoginUserHttpController,
  UserDetailsHttpController,
];

const messageControllers = [CreateUserMessageController];

const cliControllers: Provider[] = [CreateUserCliController];

const commandHandlers: Provider[] = [CreateUserService, DeleteUserService, LoginUserService];

const queryHandlers: Provider[] = [FindUsersQueryHandler];

const eventHandlers: Provider[] = [SystemLogWhenUserIsCreatedEventHandler, CallNewCommandWhenUserIsCreatedSaga];

const mappers: Provider[] = [UserMapper];

const repositories: Provider[] = [{ provide: USER_REPOSITORY, useClass: UserRepository }];

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.secret,
        signOptions: {
          expiresIn: configService.authConfig.jwtExpirationTime,
        },
      }),
      inject: [ApiConfigService],
    }),
    CqrsModule,
  ],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    JwtStrategy,
    PublicStrategy,
    ...cliControllers,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...mappers,
  ],
})
export class UserModule {}
