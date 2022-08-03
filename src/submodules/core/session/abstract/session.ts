import { Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { Executor } from '../../executor/types/executor';

export abstract class Session {
  public readonly id: string;

  constructor(protected readonly executors: Executor[]) {
    this.id = uuid();
  }

  public async start(input: Record<string, any>): Promise<void> {
    try {
      Logger.warn('Input field is not set in storage', 'Session');

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
