import { Module } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { NestFactory } from '@nestjs/core';

import { Config } from './types/transaction-declaration';
import { CoreHttpExecutor } from './executor/core-http-executor';
import { PathEvaluator } from './expression/path-evaluator';
import { SessionStorage } from './storage/session-storage';
import { VariableStorage } from './storage/variable-storage';
import { SequentialSession } from './session/sequential-session';
import { HttpCommandFactory } from './commands/http/http-command-factory';
import { ExpressionEvaluator } from './expression/expression-evaluator';
import { HttpResourceService } from './resources/http/http-resource-service';
import { CoreExecutorFactory } from './executor/core-executor-factory';
import { ExecutorFactory } from './executor/executor-factory';
import { contentSecurityPolicy } from 'helmet';

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
            PathEvaluator,
            VariableStorage,
            SequentialSession,
            CoreExecutorFactory,
            ExecutorFactory,
            {
              provide: 'Executors',
              inject: [ExecutorFactory],
              useFactory: (executorFactory: ExecutorFactory) => {
                return config.states.map((state) => {
                  const res = executorFactory.create(state.resources);

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
