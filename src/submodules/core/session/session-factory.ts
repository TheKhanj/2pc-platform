import { NestFactory } from '@nestjs/core';
import { Injectable, Module, NotImplementedException } from '@nestjs/common';

import { Config } from '../types/transaction-declaration';
import { Storage } from '../storage/storage';
import { Session } from './abstract/session';
import { Executor } from '../executor/types/executor';
import { AsyncStorage } from '../storage/async-storage';
import { SessionStorage } from '../storage/session-storage';
import { VariableStorage } from '../storage/variable-storage';
import { ExecutorFactory } from '../executor/executor-factory';
import { SequentialSession } from './sequential-session';
import { HttpCommandFactory } from '../commands/http/http-command-factory';
import { CoreExecutorFactory } from '../executor/core-executor-factory';
import { ExpressionEvaluator } from '../expression/expression-evaluator';
import { HttpResourceService } from '../resources/http/http-resource-service';
import { VariableStorageUpdater } from '../storage/updaters/variable-storage-updater';
import { ExtendedVariableStorage } from '../expression/extended-variable-storage';
import { EXECUTORS_TOKEN, SESSION_TOKEN } from '../constants';

@Injectable()
export class SessionFactory {
  constructor(
    private readonly httpResourceService: HttpResourceService,
    private readonly httpCommandFactory: HttpCommandFactory,
    private readonly sessionStorage: SessionStorage,
  ) {}

  async create(config: Config) {
    class SessionModule {}

    Module({
      providers: [
        {
          provide: HttpResourceService,
          useValue: this.httpResourceService,
        },
        {
          provide: HttpCommandFactory,
          useValue: this.httpCommandFactory,
        },
        ExpressionEvaluator,
        ExtendedVariableStorage,
        {
          provide: VariableStorage,
          useFactory: async () => {
            const _storage = new VariableStorage(new Storage());
            await _storage.set('RESULT', {});
            await _storage.set('INPUT', {});
            await _storage.set('GLOBAL', { ...config.variables });

            return _storage;
          },
        },
        CoreExecutorFactory,
        ExecutorFactory,
        VariableStorageUpdater,
        {
          provide: SESSION_TOKEN,
          inject: [EXECUTORS_TOKEN, VariableStorage],
          useFactory: (
            executors: Executor[],
            variableStorage: VariableStorage,
          ) => {
            let session: Session;

            if (config.type === 'sequential') {
              session = new SequentialSession(executors, variableStorage);
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
          useFactory: (executorFactory: ExecutorFactory) => {
            return config.states.map((state) => {
              const res = executorFactory.create(state);

              return res;
            });
          },
        },
      ],
    })(SessionModule);

    const ctx = await NestFactory.createApplicationContext(SessionModule);
    const moduleRef = ctx.select(SessionModule);

    return moduleRef;
  }
}
