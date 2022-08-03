import { HttpCommand } from './http-command';
import { HttpResource } from 'src/submodules/core/types/transaction-declaration';
import { ExpressionEvaluator } from 'src/submodules/core/expression/expression-evaluator';

export class HttpCommandFactory {
  async create(
    expressionEvaluator: ExpressionEvaluator,
    args: Pick<
      HttpResource,
      'method' | 'url' | 'headers' | 'body' | 'params' | 'queries'
    >,
  ): Promise<HttpCommand> {
    const params = args.params
      ? await expressionEvaluator.evaluate(args.params)
      : undefined;
    const queries = args.queries
      ? await expressionEvaluator.evaluate(args.queries)
      : undefined;
    const body = args.body
      ? await expressionEvaluator.evaluate(args.body)
      : undefined;
    return new HttpCommand(args.method, args.url, params, queries, body);
  }
}
