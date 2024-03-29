import { Injectable } from '@nestjs/common';

import { Storage as IStorage } from './types/storage';
import { StorageNotFoundError } from './errors/storage-not-found-error';

@Injectable()
export class Storage implements IStorage {
  private readonly _storage = {};

  get<T = any>(key: string): T {
    if (!this._storage[key]) {
      throw new StorageNotFoundError(key);
    }

    return this._storage[key];
  }

  set<T>(key: string, value: T) {
    this._storage[key] = value;
  }
}
