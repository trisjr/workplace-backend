import { PaginatedQueryRequestDto } from '@libs/api/paginated-query.request.dto';
import { ResponseBase } from '@libs/api/response.base';
import { Paginated } from '@libs/ddd';
import { Body, Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Result } from 'oxide.ts';
import { UserModel } from '../../database/user.repository';
import { UserPaginatedResponseDto } from '../../dtos/user.paginated.response.dto';
import { FindUsersQuery } from './find-users.query-handler';
import { FindUsersRequestDto } from './find-users.request.dto';

@Controller('users')
export class FindUsersHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Find users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPaginatedResponseDto,
  })
  async findUsers(
    @Body() request: FindUsersRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UserPaginatedResponseDto> {
    const query = new FindUsersQuery({
      ...request,
      limit: queryParams?.limit,
      page: queryParams?.page,
    });
    const result: Result<Paginated<UserModel>, Error> = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    // Whitelisting returned properties
    return new UserPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map((user) => ({
        ...new ResponseBase(user),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      })),
    });
  }
}
