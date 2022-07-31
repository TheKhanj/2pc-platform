export type Executor = {
  start(): Promise<any>;
  commit(): Promise<any>;
  rollback(): Promise<any>;
};
