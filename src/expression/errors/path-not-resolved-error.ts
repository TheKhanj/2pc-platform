export class PathNotResolvedError extends Error {
  constructor(public readonly problematicPath: string) {
    super();
  }
}
