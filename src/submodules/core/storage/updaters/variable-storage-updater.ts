import { Injectable } from '@nestjs/common';

import { ExecutorResult } from '../../results/executor-result';
import { ExtendedVariableStorage } from '../../expression/extended-variable-storage';

@Injectable()
export class VariableStorageUpdater {
  constructor(private readonly variableStorage: ExtendedVariableStorage) {}

  updateResult(stateName: string, res: ExecutorResult) {
    this.variableStorage.set(`$$RESULT["${stateName}"]`, res);
  }
}
