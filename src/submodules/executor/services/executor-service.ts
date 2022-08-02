import { ModuleRef } from '@nestjs/core';
import { Inject, Injectable } from '@nestjs/common';

import { SequentialSession } from 'src/submodules/core/session/sequential-session';

import { Config } from 'src/submodules/core/types/transaction-declaration';

@Injectable()
export class ExecutorService {
  constructor(
    @Inject('SessionFactory')
    private readonly sessionFactory: (
      config: Config,
    ) => Promise<{
      sessionId: string;
      moduleRef: ModuleRef;
    }>,
  ) {}

  async start(config: Config) {
    const { sessionId, moduleRef } = await this.sessionFactory(config);

    const session = moduleRef.get(SequentialSession);
    await session.start({});

    return {
      sessionId,
    };
  }
}
