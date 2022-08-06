import { NestFactory } from '@nestjs/core';
import { Injectable, Module, NotImplementedException } from '@nestjs/common';

import { Config } from '../types/transaction-declaration';
import { Storage } from '../storage/storage';
import { Session } from './abstract/session';
import { Executor } from '../executor/types/executor';
import { HttpService } from '../resources/http/http-service';
import { SessionStorage } from '../storage/session-storage';
import { VariableStorage } from '../storage/variable-storage';
import { ExecutorFactory } from '../executor/executor-factory';
import { SequentialSession } from './sequential-session';
import { CoreExecutorFactory } from '../executor/core-executor-factory';
import { ExpressionEvaluator } from '../expression/expression-evaluator';
import { VariableStorageUpdater } from '../storage/updaters/variable-storage-updater';
import { ExtendedVariableStorage } from '../expression/extended-variable-storage';
import { CoreHttpExecutorFactory } from '../executor/http/core-http-executor-factory';
import { EXECUTORS_TOKEN, SESSION_TOKEN } from '../constants';

@Injectable()
export class SessionFactory {
  constructor(
    private readonly httpResourceService: HttpService,
    private readonly sessionStorage: SessionStorage,
  ) {}

  async create(config: Config, input: Record<string, any>) {
    class SessionModule {}

    Module({
      providers: [
        {
          provide: HttpService,
          useValue: this.httpResourceService,
        },
        CoreHttpExecutorFactory,
        ExpressionEvaluator,
        ExtendedVariableStorage,
        {
          provide: VariableStorage,
          useFactory: async () => {
            const _storage = new VariableStorage(new Storage());
            await _storage.set('RESULT', {});
            await _storage.set('INPUT', input);
            await _storage.set('GLOBAL', config.variables);

            return _storage;
          },
        },
        CoreExecutorFactory,
        ExecutorFactory,
        VariableStorageUpdater,
        {
          provide: SESSION_TOKEN,
          inject: [EXECUTORS_TOKEN],
          useFactory: (executors: Executor[]) => {
            let session: Session;

            if (config.type === 'sequential') {
              session = new SequentialSession(executors);
            } else {
              throw new NotImplementedException(
                'parallel session is not implemented yet',
              );
            }

            this.sessionStorage.set(session.id, session);

            return session;
          },
        },
        {
          provide: EXECUTORS_TOKEN,
          inject: [ExecutorFactory],
          useFactory: async (executorFactory: ExecutorFactory) => {
            const promises = config.states.map((state) => {
              return executorFactory.create(state);
            });

            const res = await Promise.all(promises);

            return res;
          },
        },
      ],
    })(SessionModule);

    const ctx = await NestFactory.createApplicationContext(SessionModule, {
      abortOnError: false,
      logger: false,
    });

    const moduleRef = ctx.select(SessionModule);

    return moduleRef;
  }
}
