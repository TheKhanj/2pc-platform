import { Injectable } from '@nestjs/common';

import { HttpExecutor } from './http-executor';
import { PathEvaluator } from '../expression/path-evaluator';
import { VariableStorage } from '../variable-storage/variable-storage';
import { HttpCommandFactory } from '../commands/http/http-command-factory';
import { ExpressionEvaluator } from '../expression/expression-evaluator';
import { HttpResourceService } from '../resources/http/http-resource-service';
import { HttpResource, Resources } from '../types/transaction-declaration';

@Injectable()
export class HttpExecutorFactory {
  constructor(
    private readonly service: HttpResourceService,
    private readonly commandFactory: HttpCommandFactory,
  ) {}

  create(resources: Resources<HttpResource>) {
    const expressionEval = this.createExpressionEvaluator();
    return new HttpExecutor(
      this.service,
      expressionEval,
      resources,
      this.commandFactory,
    );
  }

  /**
   * For now create evaluator manually
   * Consider passing construction process to Nestjs for each request
   */
  private createExpressionEvaluator() {
    const storage = new VariableStorage();
    const pathEval = new PathEvaluator(storage);
    const expressionEval = new ExpressionEvaluator(pathEval);

    return expressionEval;
  }
}
