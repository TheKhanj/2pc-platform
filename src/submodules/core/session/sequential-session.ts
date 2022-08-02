import * as rx from 'rxjs';

import { Session } from './abstract/session';
import { CommitFailedError } from './errors/commit-failed-error';
import { RollbackFailedError } from './errors/rollback-failed-error';
import { COMMIT_RETRY_COUNT, ROLLBACK_RETRY_COUNT } from './constants';

export class SequentialSession<T = any> extends Session<T> {
  protected _start<R>(): Promise<R> {
    return new Promise((resolve, reject) => {
      const obs$ = rx.from(this.executors).pipe(
        rx.map((e) => rx.defer(() => rx.from(e.start()))),
        rx.concatAll(),
        rx.last(),
      );

      obs$.subscribe({
        next: (res) => {
          resolve(res);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  protected commit(): Promise<void> {
    return new Promise((resolve, reject) => {
      const obs$ = rx.from(this.executors).pipe(
        rx.map((e) => {
          return rx
            .defer(() => rx.from(e.commit()))
            .pipe(rx.retry(COMMIT_RETRY_COUNT));
        }),
        rx.concatAll(),
      );

      obs$.subscribe({
        complete: () => {
          resolve();
        },
        error: () => {
          reject(new CommitFailedError(this.id));
        },
      });
    });
  }

  protected rollback(): Promise<void> {
    return new Promise((resolve, reject) => {
      const obs$ = rx.from(this.executors).pipe(
        rx.map((e) => {
          return rx
            .defer(() => rx.from(e.rollback()))
            .pipe(rx.retry(ROLLBACK_RETRY_COUNT));
        }),
        rx.concatAll(),
      );

      obs$.subscribe({
        complete: () => {
          resolve();
        },
        error: () => {
          reject(new RollbackFailedError(this.id));
        },
      });
    });
  }
}
