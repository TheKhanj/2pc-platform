import { Method } from 'axios';

export class HttpCommand<Body = any> {
  constructor(
    public readonly method: Method,
    public readonly url: string,
    public readonly params: Record<string, string>,
    public readonly queries: Record<string, string>,
    public readonly body?: Body,
  ) {}
}
