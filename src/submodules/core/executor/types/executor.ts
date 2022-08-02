export type Executor = {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
};
