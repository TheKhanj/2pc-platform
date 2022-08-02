import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Post } from '@nestjs/common';

import { ConfigIdDto } from 'src/submodules/config/dto/config-id-dto';
import { ConfigService } from 'src/submodules/config/service/config-service';
import { ExecutorService } from '../services/executor-service';
import { TransactionIdDto } from '../dto/transaction-id-dto';

@ApiTags('Executor')
@Controller('/executor')
export class ExecutorController {
  constructor(
    private readonly service: ExecutorService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/:configId/startTransaction')
  async start(@Param() params: ConfigIdDto) {
    const config = await this.configService.getById(params.configId);
    return this.service.start(config);
  }

  @Get('/status/:transactionId/getTransactionStatus')
  async getStatus(@Param() params: TransactionIdDto) {}
}
