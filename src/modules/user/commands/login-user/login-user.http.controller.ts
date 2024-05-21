import { ApiErrorResponse } from '@libs/api/api-error.response';
import { UserNotFoundError } from '@modules/user/domain/user.errors';
import { Body, ConflictException as ConflictHttpException, Controller, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokenResponse } from '@libs/api/token.response.dto';
import { Result, match } from 'oxide.ts';
import { LoginUserCommand } from './login-user.command';
import { LoginUserRequestDto } from './login-user.request.dto';

@Controller('users')
export class LoginUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokenResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post('login')
  async create(@Body() body: LoginUserRequestDto): Promise<TokenResponse> {
    const command = new LoginUserCommand(body);

    const result: Result<TokenResponse, UserNotFoundError> = await this.commandBus.execute(command);

    return match(result, {
      Ok: (token: TokenResponse) => token,
      Err: (error: Error) => {
        if (error instanceof UserNotFoundError) throw new ConflictHttpException(error.message);
        throw error;
      },
    });
  }
}
