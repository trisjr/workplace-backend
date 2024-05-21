import { PaginatedParams, PaginatedQueryBase } from '@libs/ddd/query.base';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Paginated } from '@libs/ddd';
import { InjectPool } from 'nestjs-slonik';
import { Ok, Result } from 'oxide.ts';
import { DatabasePool, sql } from 'slonik';
import { UserModel, userSchema } from '../../database/user.repository';

export class FindUsersQuery extends PaginatedQueryBase {
  readonly firstName?: string;

  readonly lastName?: string;

  readonly phone?: string;

  constructor(props: PaginatedParams<FindUsersQuery>) {
    super(props);
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phone = props.phone;
  }
}

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler implements IQueryHandler {
  constructor(
    @InjectPool()
    private readonly pool: DatabasePool,
  ) {}

  async execute(query: FindUsersQuery): Promise<Result<Paginated<UserModel>, Error>> {
    const statement = sql.type(userSchema)`
         SELECT *
         FROM users
         WHERE
           ${query.firstName ? sql.fragment`firstName = ${query.firstName}` : true} AND
           ${query.lastName ? sql.fragment`lastName = ${query.lastName}` : true} AND
           ${query.phone ? sql.fragment`phone = ${query.phone}` : true}
         LIMIT ${query.limit}
         OFFSET ${query.offset}`;

    const records = await this.pool.query(statement);

    return Ok(
      new Paginated({
        data: records.rows,
        count: records.rowCount,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
