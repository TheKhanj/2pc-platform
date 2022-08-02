import { Injectable } from '@nestjs/common';

import { Resources } from '../types/transaction-declaration';
import { CoreExecutorFactory } from './core-executor-factory';

@Injectable()
export class ExecutorFactory {
  constructor(private readonly coreExecutorFactory: CoreExecutorFactory) {}

  create(resources: Resources) {
    return (['start', 'commit', 'rollback'] as const).reduce((ret, method) => {
      const executor = this.coreExecutorFactory.create(resources[method]);

      ret[method] = () => executor.execute();

      return ret;
    }, {});
  }
}
