import { RoleType } from '@libs/constants';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { UserDeletedDomainEvent } from '@shared/events/user//user-deleted.domain-event';
import { UserRoleChangedDomainEvent } from '@shared/events/user//user-role-changed.domain-event';
import { UserCreatedDomainEvent } from '@shared/events/user/user-created.domain-event';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CreateUserProps, UserProps } from './user.types';

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID;

  static async create(create: CreateUserProps): Promise<UserEntity> {
    const id = randomUUID();
    /* Setting a default role since we are not accepting it during creation. */
    const props: UserProps = { ...create, role: RoleType.GUEST };
    const user = new UserEntity({ id, props });

    await user.hashPassword();

    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        email: props.email,
      }),
    );
    return user;
  }

  get role(): RoleType {
    return this.props.role;
  }

  private changeRole(newRole: RoleType): void {
    this.addEvent(
      new UserRoleChangedDomainEvent({
        aggregateId: this.id,
        oldRole: this.props.role,
        newRole,
      }),
    );

    this.props.role = newRole;
  }

  private async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.props.password, salt);
    this.props.password = hashedPassword;
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.props.password);
  }

  makeAdmin(): void {
    this.changeRole(RoleType.ADMIN);
  }

  makeAgent(): void {
    this.changeRole(RoleType.AGENT);
  }

  delete(): void {
    this.addEvent(
      new UserDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
