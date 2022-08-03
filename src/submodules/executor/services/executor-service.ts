import { Inject, Injectable } from '@nestjs/common';

import { Config } from 'src/submodules/core/types/transaction-declaration';
import { Session } from 'src/submodules/core/session/abstract/session';
import { SESSION_TOKEN } from 'src/submodules/core/constants';
import { SessionFactory } from 'src/submodules/core/session/session-factory';

@Injectable()
export class ExecutorService {
  constructor(
    @Inject(SessionFactory)
    private readonly sessionFactory: SessionFactory,
  ) {}

  async start(config: Config) {
    const moduleRef = await this.sessionFactory.create(config);

    const session = moduleRef.get<Session>(SESSION_TOKEN);
    await session.start({});

    return session.id;
  }
}
