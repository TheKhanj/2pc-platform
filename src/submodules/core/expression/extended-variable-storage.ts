import { Injectable } from '@nestjs/common';

import { Path } from './types/expressions';
import { Storage } from '../storage/types/storage';
import { VariableStorage } from '../storage/variable-storage';
import { PathNotResolvedError } from './errors/path-not-resolved-error';

@Injectable()
export class ExtendedVariableStorage implements Storage {
  constructor(private readonly storage: VariableStorage) {}

  get(path: Path) {
    const arr = this.convertPathToArr(path);
    let root = this.storage.get(arr[0] as string);
    return this.recursiveGet(root, arr.slice(1));
  }

  set<T>(path: Path, value: T): void {
    const arr = this.convertPathToArr(path);
    const root = this.storage.get(arr[0] as string);
    const parent = this.recursiveGet(root, arr.slice(1, -1));
    parent[arr[arr.length - 1]] = value;
    this.storage.set(arr[0] as any, root);
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
