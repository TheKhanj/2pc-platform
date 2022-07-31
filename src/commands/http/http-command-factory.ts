import { Logger } from '@nestjs/common';

import { HttpCommand } from './http-command';
import { HttpResource } from 'src/types/transaction-declaration';
import { VariableStorage } from 'src/variable-storage/variable-storage';

export class HttpCommandFactory {
  async create(
    storage: VariableStorage,
    args: Pick<
      HttpResource,
      'method' | 'url' | 'headers' | 'body' | 'params' | 'queries'
    >,
  ): Promise<HttpCommand> {
    Logger.warn('Not implemented yet', 'HttpCommandFactory');
    const params = {};
    const queries = {};
    const body = {};
    return new HttpCommand(args.method, args.url, params, queries, body);
  }
}
