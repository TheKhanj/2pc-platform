export type Executor = {
  start(): Promise<any>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
};
