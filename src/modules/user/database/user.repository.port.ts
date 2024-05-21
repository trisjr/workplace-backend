import { RepositoryPort } from '@libs/ddd';
import { RoleType } from '@libs/constants';
import { UserEntity } from '../domain/user.entity';

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
  findOneByEmail(email: string): Promise<UserEntity | null>;
  findOneByIdAndRole(id: string, role: RoleType): Promise<UserEntity | null>;
}
