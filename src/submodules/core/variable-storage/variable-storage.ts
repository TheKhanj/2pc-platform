import { Injectable, Scope } from '@nestjs/common';

import { VariableNotFoundError } from './errors/variable-not-found-error';

@Injectable({
  scope: Scope.REQUEST,
})
export class VariableStorage {
  private readonly variables = {};

  get<T = any>(key: string): T {
    if (!this.variables[key]) {
      throw new VariableNotFoundError(key);
    }

    return this.variables[key];
  }

  set<T>(key: string, value: T) {
    this.variables[key] = value;
  }
}
