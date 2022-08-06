import { HttpResult } from '../../results/http-result';
import { HttpCommand } from '../../commands/http-command';
import { HttpService } from 'src/submodules/core/resources/http/http-service';
import { CoreExecutor } from '../types/core-executor';
import { HttpResource } from '../../types/transaction-declaration';
import { ExpressionEvaluator } from '../../expression/expression-evaluator';

export class CoreHttpExecutor implements CoreExecutor {
  constructor(
    private readonly expressionEvaluator: ExpressionEvaluator,
    private readonly httpService: HttpService,
    private readonly args: Pick<
      HttpResource,
      'method' | 'url' | 'headers' | 'body' | 'params' | 'queries'
    >,
  ) {}

  async execute(): Promise<HttpResult> {
    const params = this.args.params
      ? await this.expressionEvaluator.evaluate(this.args.params)
      : undefined;
    const queries = this.args.queries
      ? await this.expressionEvaluator.evaluate(this.args.queries)
      : undefined;
    const headers = this.args.headers
      ? await this.expressionEvaluator.evaluate(this.args.headers)
      : undefined;
    const body = this.args.body
      ? await this.expressionEvaluator.evaluate(this.args.body)
      : undefined;

    const command = new HttpCommand(
      this.args.method,
      this.args.url,
      params,
      queries,
      headers,
      body,
    );

    return this.httpService.call(command);
  }
}
