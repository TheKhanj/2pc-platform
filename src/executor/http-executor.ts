import { Executor } from './types/executor';
import { HttpCommandFactory } from 'src/commands/http/http-command-factory';
import { ExpressionEvaluator } from 'src/expression/expression-evaluator';
import { HttpResourceService } from 'src/resources/http/http-resource-service';
import { HttpResource, Resources } from 'src/types/transaction-declaration';

export class HttpExecutor implements Executor {
  constructor(
    private readonly service: HttpResourceService,
    private readonly expressionEvaluator: ExpressionEvaluator,
    private readonly resources: Resources<HttpResource>,
    private readonly factory: HttpCommandFactory,
  ) {}

  async start() {
    const command = await this.factory.create(
      this.expressionEvaluator,
      this.resources.start,
    );

    return this.service.call(command);
  }

  async commit() {
    const command = await this.factory.create(
      this.expressionEvaluator,
      this.resources.commit,
    );

    await this.service.call(command);
  }

  async rollback() {
    const command = await this.factory.create(
      this.expressionEvaluator,
      this.resources.commit,
    );

    await this.service.call(command);
  }
}
