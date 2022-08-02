import { CoreExecutor } from './types/core-executor';
import { Executor as IExecutor } from './types/executor';

export class Executor implements IExecutor {
  constructor(
    private readonly _start: CoreExecutor,
    private readonly _commit: CoreExecutor,
    private readonly _rollback: CoreExecutor,
  ) {}

  async start(): Promise<void> {
    return this._start.execute();
  }

  async commit(): Promise<void> {
    return this._commit.execute();
  }

  async rollback(): Promise<void> {
    return this._rollback.execute();
  }
}
