import { Injectable } from '@nestjs/common';

import { HttpCommand } from '../../commands/http-command';
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
      'method' | 'url' | 'headers' | 'body' | 'params' | 'queries'
    >,
  ): Promise<CoreHttpExecutor> {
    const params = args.params
      ? await this.expressionEvaluator.evaluate(args.params)
      : undefined;
    const queries = args.queries
      ? await this.expressionEvaluator.evaluate(args.queries)
      : undefined;
    const body = args.body
      ? await this.expressionEvaluator.evaluate(args.body)
      : undefined;

    const command = new HttpCommand(
      args.method,
      args.url,
      params,
      queries,
      body,
    );

    return new CoreHttpExecutor(command, this.httpService);
  }
}
