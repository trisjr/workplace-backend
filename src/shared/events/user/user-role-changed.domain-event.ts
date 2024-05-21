import { DomainEvent, DomainEventProps } from '@libs/ddd';
import { RoleType } from '@libs/constants';

export class UserRoleChangedDomainEvent extends DomainEvent {
  readonly oldRole: RoleType;

  readonly newRole: RoleType;

  constructor(props: DomainEventProps<UserRoleChangedDomainEvent>) {
    super(props);
    this.oldRole = props.oldRole;
    this.newRole = props.newRole;
  }
}
