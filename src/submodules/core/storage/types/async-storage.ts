export type AsyncStorage = {
  get<T = any>(key: string): Promise<T>;
  set<T>(key: string, value: T): Promise<void>;
};
