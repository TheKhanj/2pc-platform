import { Module } from '@nestjs/common';

import { ExecutorService } from './services/executor-service';
import { ExecutorController } from './controllers/executor-controller';

@Module({
  controllers: [ExecutorController],
  providers: [ExecutorService],
})
export class ExecutorModule {}
