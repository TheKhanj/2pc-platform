export class RollbackFailedError extends Error {
  constructor(public readonly sessionId: string) {
    super();
  }
}
