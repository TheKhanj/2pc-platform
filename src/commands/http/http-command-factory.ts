import { HttpCommand } from './http-command';
import { HttpResource } from 'src/types/transaction-declaration';
import { ExpressionEvaluator } from 'src/expression/expression-evaluator';

export class HttpCommandFactory {
  async create(
    expressionEvaluator: ExpressionEvaluator,
    args: Pick<
      HttpResource,
      'method' | 'url' | 'headers' | 'body' | 'params' | 'queries'
    >,
  ): Promise<HttpCommand> {
    const params = args.params
      ? expressionEvaluator.evaluate(args.params)
      : undefined;
    const queries = args.queries
      ? expressionEvaluator.evaluate(args.queries)
      : undefined;
    const body = args.body
      ? expressionEvaluator.evaluate(args.body)
      : undefined;
    return new HttpCommand(args.method, args.url, params, queries, body);
  }
}
