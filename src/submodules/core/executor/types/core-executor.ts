import { ExecutorResult } from '../../results/executor-result';

export type CoreExecutor = {
  execute(): Promise<ExecutorResult>;
};
