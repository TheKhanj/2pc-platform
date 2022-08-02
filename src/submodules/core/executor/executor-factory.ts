import { Injectable } from '@nestjs/common';

import { State } from '../types/transaction-declaration';
import { Executor } from './executor';
import { CoreExecutor } from './types/core-executor';
import { CoreExecutorFactory } from './core-executor-factory';
import { VariableStorageUpdater } from '../storage/updaters/variable-storage-updater';

@Injectable()
export class ExecutorFactory {
  constructor(
    private readonly coreExecutorFactory: CoreExecutorFactory,
    private readonly variableStorageUpdater: VariableStorageUpdater,
  ) {}

  create(state: State): Executor {
    const coreExecutors = (['start', 'commit', 'rollback'] as const).reduce(
      (ret, method) => {
        ret[method] = this.coreExecutorFactory.create(state.resources[method]);
        return ret;
      },
      {},
    ) as { [key in 'start' | 'commit' | 'rollback']: CoreExecutor };

    return new Executor(
      state.name,
      this.variableStorageUpdater,
      coreExecutors['start'],
      coreExecutors['commit'],
      coreExecutors['rollback'],
    );
  }
}
