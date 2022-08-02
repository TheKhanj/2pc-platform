export type Storage = {
  get<T = any>(key: string): T;
  set<T>(key: string, value: T): void;
};
