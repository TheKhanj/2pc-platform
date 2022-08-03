import { Injectable } from '@nestjs/common';

import { isPath } from './utils/is-path';
import { Expression } from './types/expressions';
import { ExtendedVariableStorage } from './extended-variable-storage';

@Injectable()
export class ExpressionEvaluator {
  constructor(private readonly variableStorage: ExtendedVariableStorage) {}

  async evaluate(e: Expression) {
    if (typeof e === 'string') {
      if (isPath(e)) {
        return this.variableStorage.get(e);
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
      const promises = e.map((e) => this.evaluate(e));

      return Promise.all(promises);
    }

    const promises = Object.keys(e).map(async (key) => {
      const evaluatedKey = await this.evaluate(key);
      const evaluatedValue = await this.evaluate(e[key]);
      return {
        key: evaluatedKey,
        value: evaluatedValue,
      };
    });

    const res = await Promise.all(promises);

    return res.reduce((ret, curr) => {
      ret[curr.key] = curr.value;
      return ret;
    }, {});
  }
}
