export class CommitFailedError extends Error {
  constructor(public readonly sessionId: string) {
    super();
  }
}
