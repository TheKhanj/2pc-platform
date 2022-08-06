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

  async create(state: State): Promise<Executor> {
    const promises = (['start', 'commit', 'rollback'] as const).map(
      async (method) => {
        return {
          method,
          executor: await this.coreExecutorFactory.create(
            state.resources[method],
          ),
        };
      },
    );

    const executors = await Promise.all(promises);

    const coreExecutors = executors.reduce((ret, exec) => {
      ret[exec.method] = exec.executor;
      return ret;
    }, {}) as {
      [key in 'start' | 'commit' | 'rollback']: CoreExecutor;
    };

    return new Executor(
      state.name,
      this.variableStorageUpdater,
      coreExecutors['start'],
      coreExecutors['commit'],
      coreExecutors['rollback'],
    );
  }
}
