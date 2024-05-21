import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedDomainEvent } from '@shared/events/user/user-created.domain-event';
import { LoggerPort } from '@libs/ports/logger.port';
import { UserRepositoryPort } from '../../database/user.repository.port';
import { USER_REPOSITORY } from '../../user.di-tokens';

@Injectable()
export class SystemLogWhenUserIsCreatedEventHandler {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerPort,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  @OnEvent(UserCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserCreatedDomainEvent): Promise<any> {
    this.logger.debug(`User account was created with id: ${event.aggregateId} and email: ${event.email}`);
  }
}
