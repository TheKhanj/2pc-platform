import { Injectable } from '@nestjs/common';

import { Path } from './types/expressions';
import { VariableStorage } from '../storage/variable-storage';
import { PathNotResolvedError } from './errors/path-not-resolved-error';

@Injectable()
export class PathEvaluator {
  constructor(private readonly storage: VariableStorage) {}

  evaluate(path: Path) {
    const query = '.' + this.normalize(path).slice(2);
    const arr = this.convertQueryToArr(query);
    let root = this.storage.get(arr[0] as string);
    arr.slice(1).forEach((key, index) => {
      root = root[key];
      if (!root) {
        throw new PathNotResolvedError(arr.slice(0, index + 1).join('.'));
      }
    });

    return root;
  }

  private convertQueryToArr(query: string): (string | number)[] {
    const singleQuoteMatch = /'[^']+'/;
    const doubleQuoteMatch = /"[^"]+"/;
    const quoteMatch = new RegExp(
      `(${singleQuoteMatch.source}|${doubleQuoteMatch.source})`,
    );
    const arrayMatch = new RegExp(`\\[${quoteMatch.source}\\]`);
    const dotMatch = /(\.[^\.\[\]]+)/;
    const selectorMatch = new RegExp(
      `(${dotMatch.source}|${arrayMatch.source})`,
      'g',
    );

    return (
      query.match(selectorMatch)?.map((key) => {
        if (key.match(dotMatch)) {
          return key.slice(1);
        }
        const ret = key.split(/["']/)[1];

        // check if index is number
        if (ret.match(/\d+/)) {
          return +ret;
        }

        return ret;
      }) || []
    );
  }

  private normalize(path: Path): Path {
    if (path[1] == '$') {
      return path;
    }

    return ('$$GLOBAL' + path.slice(1)) as any;
  }
}
