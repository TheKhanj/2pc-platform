import { Injectable } from '@nestjs/common';

import { Path } from './types/expressions';
import { AsyncStorage } from '../storage/types/async-storage';
import { VariableStorage } from '../storage/variable-storage';
import { PathNotResolvedError } from './errors/path-not-resolved-error';

@Injectable()
export class ExtendedVariableStorage implements AsyncStorage {
  constructor(private readonly storage: VariableStorage) {}

  async get(path: Path) {
    const arr = this.convertPathToArr(path);
    let root = await this.storage.get(arr[0] as string);
    return this.recursiveGet(root, arr.slice(1));
  }

  async set<T>(path: Path, value: T): Promise<void> {
    const arr = this.convertPathToArr(path);
    const root = await this.storage.get(arr[0] as string);
    const parent = this.recursiveGet(root, arr.slice(1, -1));
    parent[arr[arr.length - 1]] = value;
    await this.storage.set(arr[0] as any, root);
  }

  private recursiveGet(obj: any, arr: (string | number)[]) {
    let root = obj;
    arr.forEach((key, index) => {
      root = root[key];
      if (!root) {
        throw new PathNotResolvedError(arr.slice(0, index + 1).join('.'));
      }
    });

    return root;
  }

  private convertPathToArr(path: Path): (string | number)[] {
    const query = '.' + this.normalize(path).slice(2);
    const arr = this.convertQueryToArr(query);
    return arr;
  }

  private convertQueryToArr(query: string): (string | number)[] {
    const singleQuoteString$ = /'[^']+'/;
    const doubleQuoteString$ = /"[^"]+"/;
    const quoteString$ = new RegExp(
      `(${singleQuoteString$.source}|${doubleQuoteString$.source})`,
    );
    const number$ = /\d+/;
    const bracketNumberSelector$ = new RegExp(`\\[${number$.source}\\]`);
    const bracketQuoteSelector$ = new RegExp(`\\[${quoteString$.source}\\]`);
    const bracketSelector$ = new RegExp(
      `(${bracketQuoteSelector$.source}|${bracketNumberSelector$.source})`,
    );
    const dotStringSelector$ = /\.[^\.\[\]]+/;
    const dotNumberSelector$ = new RegExp(`\\.${number$.source}`);
    const selector$ = new RegExp(
      `(${dotStringSelector$.source}|${dotNumberSelector$.source}|${bracketSelector$.source})`,
      'g',
    );

    return (
      query.match(selector$)?.map((key) => {
        function regGen(regex: RegExp) {
          return new RegExp(`^${regex.source}$`);
        }

        if (key.match(regGen(dotNumberSelector$))) {
          return +key.slice(1);
        }

        if (key.match(regGen(dotStringSelector$))) {
          return key.slice(1);
        }

        if (key.match(regGen(bracketNumberSelector$))) {
          return +key.slice(1, -1);
        }

        const ret = key.slice(2, -2);

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
