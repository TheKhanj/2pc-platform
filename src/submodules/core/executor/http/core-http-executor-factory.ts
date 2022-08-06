import { Injectable } from '@nestjs/common';

import { HttpService } from '../../resources/http/http-service';
import { HttpResource } from 'src/submodules/core/types/transaction-declaration';
import { CoreHttpExecutor } from './core-http-executor';
import { ExpressionEvaluator } from 'src/submodules/core/expression/expression-evaluator';

@Injectable()
export class CoreHttpExecutorFactory {
  constructor(
    private readonly expressionEvaluator: ExpressionEvaluator,
    private readonly httpService: HttpService,
  ) {}

  async create(
    args: Pick<
      HttpResource,
      'method' | 'url' | 'headers' | 'body' | 'params' | 'queries' | 'headers'
    >,
  ): Promise<CoreHttpExecutor> {
    return new CoreHttpExecutor(
      this.expressionEvaluator,
      this.httpService,
      args,
    );
  }
}
