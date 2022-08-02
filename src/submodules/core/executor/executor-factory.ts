import { Injectable } from '@nestjs/common';

import { Resources } from '../types/transaction-declaration';
import { CoreExecutorFactory } from './core-executor-factory';

@Injectable()
export class ExecutorFactory {
  constructor(private readonly coreExecutorFactory: CoreExecutorFactory) {}

  create(resources: Resources) {
    return (['start', 'commit', 'rollback'] as const).map((method) =>
      this.coreExecutorFactory.create(method, resources[method]),
    );
  }
}
