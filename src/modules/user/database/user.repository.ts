import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoleType } from '@libs/constants';
import { SqlRepositoryBase } from '@libs/db/sql-repository.base';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { z } from 'zod';
import { UserEntity } from '../domain/user.entity';
import { UserMapper } from '../user.mapper';
import { UserRepositoryPort } from './user.repository.port';

export const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.preprocess((val: any) => new Date(val), z.date()),
  updatedAt: z.preprocess((val: any) => new Date(val), z.date()),
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string(),
  password: z.string(),
  role: z.nativeEnum(RoleType),
});

export type UserModel = z.TypeOf<typeof userSchema>;

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
export class UserRepository extends SqlRepositoryBase<UserEntity, UserModel> implements UserRepositoryPort {
  protected tableName = 'users';

  protected schema = userSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    mapper: UserMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(UserRepository.name));
  }

  async findOneByIdAndRole(id: string, role: RoleType): Promise<UserEntity | null> {
    const user = await this.pool.one(sql.type(userSchema)`SELECT * FROM "users" WHERE id = ${id} and role = ${role}`);

    return this.mapper.toDomain(user);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.pool.one(sql.type(userSchema)`SELECT * FROM "users" WHERE email = ${email}`);

    return this.mapper.toDomain(user);
  }
}
