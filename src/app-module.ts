import { Module } from '@nestjs/common';

import { ConfigModule } from './submodules/config/config-module';

@Module({
  imports: [ConfigModule],
})
export class AppModule {}
