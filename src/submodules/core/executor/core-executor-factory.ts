import { Injectable, NotImplementedException } from '@nestjs/common';

import { Resource } from '../types/transaction-declaration';
import { CoreExecutor } from './types/core-executor';
import { CoreHttpExecutorFactory } from './http/core-http-executor-factory';

@Injectable()
export class CoreExecutorFactory {
  constructor(
    private readonly coreHttpExecutorFactory: CoreHttpExecutorFactory,
  ) {}

  async create(resource: Resource): Promise<CoreExecutor> {
    if (resource.type === 'http') {
      return this.coreHttpExecutorFactory.create(resource);
    }

    throw new NotImplementedException(
      'RabbitMq executor factory is not implemented yet',
    );
  }
}
