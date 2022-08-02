import { Controller, Get, Param, Post } from '@nestjs/common';

import { ConfigIdDto } from 'src/submodules/config/dto/config-id-dto';
import { SessionIdDto } from '../dto/session-id-dto';

@Controller('/executor')
export class ExecutorController {
  @Post('/:configId')
  async start(@Param() params: ConfigIdDto) {}

  @Get('/status/:sessionId')
  async getStatus(@Param() params: SessionIdDto) {}
}
