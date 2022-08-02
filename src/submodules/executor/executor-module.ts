import { Module } from '@nestjs/common';

import { CoreModule } from '../core/core-module';
import { ConfigModule } from '../config/config-module';
import { ExecutorService } from './services/executor-service';
import { ExecutorController } from './controllers/executor-controller';

@Module({
  imports: [ConfigModule, CoreModule],
  controllers: [ExecutorController],
  providers: [ExecutorService],
})
export class ExecutorModule {}
