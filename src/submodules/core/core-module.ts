import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { Config } from './types/transaction-declaration';
import { PathEvaluator } from './expression/path-evaluator';
import { SessionStorage } from './storage/session-storage';
import { VariableStorage } from './storage/variable-storage';
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
            {
              provide: 'Resources',
              useValue: config.states
            },
          ],
        })(MiniModule);

        const ctx = await NestFactory.createApplicationContext(MiniModule);
        const moduleRef = ctx.select(MiniModule);

        return moduleRef;
      },
    },
  ],
})
export class CoreModule {}
