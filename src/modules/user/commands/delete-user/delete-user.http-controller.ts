import { ApiErrorResponse } from '@libs/api/api-error.response';
import { NotFoundException } from '@libs/exceptions';
import { Controller, Delete, HttpStatus, NotFoundException as NotFoundHttpException, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Result, match } from 'oxide.ts';
import { DeleteUserCommand } from './delete-user.service';

@Controller('users')
export class DeleteUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    description: 'User deleted',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: NotFoundException.message,
    type: ApiErrorResponse,
  })
  @Delete()
  async deleteUser(@Param('id') id: string): Promise<void> {
    const command = new DeleteUserCommand({ userId: id });
    const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof NotFoundException) throw new NotFoundHttpException(error.message);
        throw error;
      },
    });
  }
}
