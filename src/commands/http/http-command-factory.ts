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
    const params = expressionEvaluator.evaluate(args.params);
    const queries = expressionEvaluator.evaluate(args.queries);
    const body = args.body
      ? expressionEvaluator.evaluate(args.body)
      : undefined;
    return new HttpCommand(args.method, args.url, params, queries, body);
  }
}
