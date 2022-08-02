import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from './service/config-service';
import { ConfigController } from './controller/config-controller';
import { ConfigModel, ConfigSchema } from './models/config-model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ConfigModel.name,
        schema: ConfigSchema,
      },
    ]),
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
