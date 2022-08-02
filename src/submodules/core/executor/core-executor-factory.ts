import { Injectable, NotImplementedException } from '@nestjs/common';

import { Resource } from '../types/transaction-declaration';
import { CoreExecutor } from './types/core-executor';
import { CoreHttpExecutor } from './core-http-executor';
import { HttpCommandFactory } from '../commands/http/http-command-factory';
import { ExpressionEvaluator } from '../expression/expression-evaluator';
import { HttpResourceService } from '../resources/http/http-resource-service';

@Injectable()
export class CoreExecutorFactory {
  constructor(
    private readonly httpResourceService: HttpResourceService,
    private readonly httpCommandFactory: HttpCommandFactory,
    private readonly expressionEvaluator: ExpressionEvaluator,
  ) {}

  create(
    resourceMethod: 'commit' | 'start' | 'rollback',
    resource: Resource,
  ): CoreExecutor {
    if (resource.type === 'http') {
      return new CoreHttpExecutor(
        this.httpResourceService,
        this.expressionEvaluator,
        resource,
        this.httpCommandFactory,
        resourceMethod,
      );
    }

    throw new NotImplementedException(
      'RabbitMq executor factory is not implemented yet',
    );
  }
}
