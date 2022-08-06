import { Module } from '@nestjs/common';

import { HttpService } from './resources/http/http-service';
import { SessionStorage } from './storage/session-storage';
import { SessionFactory } from './session/session-factory';

@Module({
  providers: [HttpService, SessionStorage, SessionFactory],
  exports: [SessionFactory],
})
export class CoreModule {}
