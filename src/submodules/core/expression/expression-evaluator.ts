import { Injectable } from '@nestjs/common';

import { isPath } from './utils/is-path';
import { Expression } from './types/expressions';
import { PathEvaluator } from './path-evaluator';

@Injectable()
export class ExpressionEvaluator {
  constructor(private readonly pathEvaluator: PathEvaluator) {}

  evaluate(e: Expression) {
    if (typeof e === 'string') {
      if (isPath(e)) {
        return this.pathEvaluator.evaluate(e);
      }

      return e;
    }

    if (typeof e === 'number' || typeof e === 'bigint') {
      return e;
    }

    if (typeof e === 'boolean') {
      return e;
    }

    if (Array.isArray(e)) {
      return e.map((e) => this.evaluate(e));
    }

    return Object.keys(e).reduce((ret, key) => {
      const evaluatedKey = this.evaluate(key);
      ret[evaluatedKey] = this.evaluate(e[key]);
      return ret;
    }, {});
  }
}
