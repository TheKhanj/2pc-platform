import { Module } from '@nestjs/common';

import { SessionStorage } from './storage/session-storage';
import { SessionFactory } from './session/session-factory';
import { HttpCommandFactory } from './commands/http/http-command-factory';
import { HttpResourceService } from './resources/http/http-resource-service';

@Module({
  providers: [
    HttpResourceService,
    HttpCommandFactory,
    SessionStorage,
    SessionFactory,
  ],
  exports: [SessionFactory],
})
export class CoreModule {}
