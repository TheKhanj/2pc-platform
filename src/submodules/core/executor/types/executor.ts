import { ExecutorResult } from '../../results/executor-result';

export type Executor = {
  start(): Promise<ExecutorResult>;
  commit(): Promise<ExecutorResult>;
  rollback(): Promise<ExecutorResult>;
};
