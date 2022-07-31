import { Expression, Path } from './types/expressions';
import { VariableStorage } from 'src/variable-storage/variable-storage';
import { isPath } from './utils/is-path';

export class ExpressionEvaluator {
  constructor(private readonly storage: VariableStorage) {}

  evaluate(e: Expression) {
    if (typeof e === 'string') {
      if (isPath(e)) {
        return this.evaluatePath(e);
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

  evaluatePath(path: Path) {
    return 0;
  }
}
