import { Injectable } from '@nestjs/common';

import { ExecutorResult } from '../../results/executor-result';
import { VariableStorage } from '../variable-storage';

@Injectable()
export class VariableStorageUpdater {
  constructor(private readonly variableStorage: VariableStorage) {}

  update(stateName: string, res: ExecutorResult) {}
}
