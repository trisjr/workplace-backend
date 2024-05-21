import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@modules/user/domain/user.entity';

export function AuthUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = <UserEntity>request.user;

    if (user?.[Symbol.for('isPublic')]) {
      return;
    }

    return user;
  })();
}
