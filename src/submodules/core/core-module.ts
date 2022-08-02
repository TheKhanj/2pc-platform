import { Module } from '@nestjs/common';

import { HttpCommandFactory } from './commands/http/http-command-factory';
import { HttpResourceService } from './resources/http/http-resource-service';

@Module({
  providers: [HttpResourceService, HttpCommandFactory],
})
export class CoreModule {}
