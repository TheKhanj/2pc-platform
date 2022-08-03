import { CoreExecutor } from './types/core-executor';
import { ExecutorResult } from '../results/executor-result';
import { Executor as IExecutor } from './types/executor';
import { VariableStorageUpdater } from '../storage/updaters/variable-storage-updater';

export class Executor implements IExecutor {
  constructor(
    private readonly stateName: string,
    private readonly variableStorageUpdater: VariableStorageUpdater,
    private readonly _start: CoreExecutor,
    private readonly _commit: CoreExecutor,
    private readonly _rollback: CoreExecutor,
  ) {}

  async start(): Promise<ExecutorResult> {
    const res = await this._start.execute();

    await this.variableStorageUpdater.updateResult(this.stateName, res);

    return res;
  }

  async commit(): Promise<ExecutorResult> {
    return this._commit.execute();
  }

  async rollback(): Promise<ExecutorResult> {
    return this._rollback.execute();
  }
}
