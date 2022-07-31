import { Module } from '@nestjs/common';

import { ConfigService } from './service/config-service';
import { ConfigController } from './controller/config-controller';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}
