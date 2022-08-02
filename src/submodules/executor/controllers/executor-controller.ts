import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Post } from '@nestjs/common';

import { ConfigIdDto } from 'src/submodules/config/dto/config-id-dto';
import { TransactionIdDto } from '../dto/transaction-id-dto';

@ApiTags('Executor')
@Controller('/executor')
export class ExecutorController {
  @Post('/:configId/startTransaction')
  async start(@Param() params: ConfigIdDto) {}

  @Get('/status/:transactionId/getTransactionStatus')
  async getStatus(@Param() params: TransactionIdDto) {}
}
