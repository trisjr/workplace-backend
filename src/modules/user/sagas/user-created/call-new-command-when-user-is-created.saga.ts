import { LoggerPort } from '@libs/ports/logger.port';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CallNewCommandWhenUserIsCreatedSaga {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerPort,
  ) {}
  // @Saga()
  // handlerUserWasCreated = (events$: Observable<any>): Observable<ICommand> => {
  //   return events$.pipe(
  //     ofType(UserCreatedDomainEvent),
  //     delay(1000),
  //     map((event) => {
  //       this.logger.log('saga call new command');
  //       return new Command
  //     }),
  //   );
  // };
}
