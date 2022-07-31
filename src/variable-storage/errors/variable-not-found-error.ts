export class VariableNotFoundError extends Error {
  constructor(key: string) {
    super(`Variable '${key}' not found`);
  }
}
