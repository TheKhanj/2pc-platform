export class StorageNotFoundError extends Error {
  constructor(key: string) {
    super(`'${key}' not found in storage`);
  }
}
