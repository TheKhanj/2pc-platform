import { Module } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { NestFactory } from '@nestjs/core';

import { Config } from './types/transaction-declaration';
import { SessionStorage } from './storage/session-storage';
import { VariableStorage } from './storage/variable-storage';
import { ExecutorFactory } from './executor/executor-factory';
import { SequentialSession } from './session/sequential-session';
import { HttpCommandFactory } from './commands/http/http-command-factory';
import { ExpressionEvaluator } from './expression/expression-evaluator';
import { HttpResourceService } from './resources/http/http-resource-service';
import { CoreExecutorFactory } from './executor/core-executor-factory';
import { VariableStorageUpdater } from './storage/updaters/variable-storage-updater';
import { ExtendedVariableStorage } from './expression/extended-variable-storage';
import { EXECUTORS_TOKEN } from './constants';

@Module({
  providers: [
    HttpResourceService,
    HttpCommandFactory,
    SessionStorage,
    {
      provide: 'SessionFactory',
      inject: [HttpResourceService, HttpCommandFactory, SessionStorage],
      useFactory: (
        httpResourceService: HttpResourceService,
        httpCommandFactory: HttpCommandFactory,
        sessionStorage: SessionStorage,
      ) => async (config: Config) => {
        class MiniModule {}

        Module({
          providers: [
            {
              provide: HttpResourceService,
              useValue: httpResourceService,
            },
            {
              provide: HttpCommandFactory,
              useValue: httpCommandFactory,
            },
            ExpressionEvaluator,
            ExtendedVariableStorage,
            VariableStorage,
            SequentialSession,
            CoreExecutorFactory,
            ExecutorFactory,
            VariableStorageUpdater,
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
        })(MiniModule);

        const ctx = await NestFactory.createApplicationContext(MiniModule);
        const moduleRef = ctx.select(MiniModule);

        const sessionId = uuid();

        sessionStorage.set(sessionId, moduleRef);

        return {
          sessionId,
          moduleRef,
        };
      },
    },
  ],
  exports: ['SessionFactory'],
})
export class CoreModule {}
