export type ResourceService<Command = any, Result = any> = {
  call(command: Command): Promise<Result>;
};
