import { Injectable } from '@nestjs/common';

import { Storage } from './storage';
import { AsyncStorage as IAsyncStorage } from './types/async-storage';

@Injectable()
export class AsyncStorage implements IAsyncStorage {
  constructor(private readonly storage: Storage) {}

  async get<T = any>(key: string): Promise<T> {
    return this.storage.get(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    return this.storage.set(key, value);
  }
}
