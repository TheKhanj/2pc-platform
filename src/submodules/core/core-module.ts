import { Module } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { NestFactory } from '@nestjs/core';

import { Config } from './types/transaction-declaration';
import { HttpExecutor } from './executor/http-executor';
import { PathEvaluator } from './expression/path-evaluator';
import { SessionStorage } from './storage/session-storage';
import { VariableStorage } from './storage/variable-storage';
import { SequentialSession } from './session/sequential-session';
import { HttpCommandFactory } from './commands/http/http-command-factory';
import { ExpressionEvaluator } from './expression/expression-evaluator';
import { HttpResourceService } from './resources/http/http-resource-service';

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
            {
              provide: 'Executors',
              inject: [ExpressionEvaluator],
              useFactory: (expressionEvaluator) => {
                return config.states.map(
                  (state) =>
                    new HttpExecutor(
                      httpResourceService,
                      expressionEvaluator,
                      state.resources as any, // TODO: FIX THIS
                      httpCommandFactory,
                    ),
                );
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
