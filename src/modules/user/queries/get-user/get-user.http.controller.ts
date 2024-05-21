import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleType } from '@libs/constants';
import { AuthUser } from '@libs/decorators/auth-user.decorator';
import { Auth } from '@libs/decorators/http.decorators';
import { UserEntity } from '../../domain/user.entity';
import { UserResponseDto } from '../../dtos/user.response.dto';

@Controller('users')
export class UserDetailsHttpController {
  constructor() {}

  @Get('me')
  @ApiOperation({ summary: 'Get user detail' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @Auth([RoleType.USER, RoleType.ADMIN, RoleType.AGENT])
  getUserDetails(@AuthUser() user: UserEntity): UserResponseDto {
    return new UserResponseDto(user.getProps());
  }
}
