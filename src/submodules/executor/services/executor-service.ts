import { Injectable } from '@nestjs/common';

import { Config } from 'src/submodules/core/types/transaction-declaration';

@Injectable()
export class ExecutorService {
  async start(config: Config) {
  }
}
