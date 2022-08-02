import {
  HttpResource,
} from 'src/submodules/core/types/transaction-declaration';
import { CoreExecutor } from './types/core-executor';
import { HttpCommandFactory } from 'src/submodules/core/commands/http/http-command-factory';
import { ExpressionEvaluator } from 'src/submodules/core/expression/expression-evaluator';
import { HttpResourceService } from 'src/submodules/core/resources/http/http-resource-service';

export class CoreHttpExecutor implements CoreExecutor {
  constructor(
    private readonly service: HttpResourceService,
    private readonly expressionEvaluator: ExpressionEvaluator,
    private readonly resource: HttpResource,
    private readonly factory: HttpCommandFactory,
  ) {}

  async execute() {
    const command = await this.factory.create(
      this.expressionEvaluator,
      this.resource,
    );

    await this.service.call(command);
  }
}
