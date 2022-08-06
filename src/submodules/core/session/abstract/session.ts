import { v4 as uuid } from 'uuid';

import { Executor } from '../../executor/types/executor';

export abstract class Session {
  public readonly id: string;

  constructor(protected readonly executors: Executor[]) {
    this.id = uuid();
  }

  public async start(): Promise<void> {
    try {
      await this._start();
      await this.commit();
    } catch (err) {
      await this.rollback();
      throw err;
    }
  }

  protected abstract _start(): Promise<void>;

  protected abstract commit(): Promise<void>;

  protected abstract rollback(): Promise<void>;
}
