export type HttpResult<T = any> = {
  status: number;
  headers: Record<string, string>;
  body: T;
};
