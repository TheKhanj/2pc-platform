import { Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { Executor } from 'src/submodules/core/executor/types/executor';
import { VariableStorage } from '../../storage/variable-storage';

export abstract class Session<R> {
  protected readonly id: string;

  constructor(
    protected readonly executors: Executor[],
    protected readonly storage: VariableStorage,
  ) {
    this.id = uuid();
  }

  public async start(input: Record<string, any>): Promise<R> {
    try {
      Logger.warn('Input field is not set in storage', 'Session');

      const res = await this._start();
      await this.commit();

      return res;
    } catch (err) {
      await this.rollback();
      throw err;
    }
  }

  protected abstract _start(): Promise<R>;

  protected abstract commit(): Promise<void>;

  protected abstract rollback(): Promise<void>;
}
