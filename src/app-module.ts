import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from './submodules/config/config-module';
import { ExecutorModule } from './submodules/executor/executor-module';

const dbUrl = [
  process.env.DB_HOST,
  process.env.DB_PORT,
  process.env.DB_NAME,
].reduce((ret, value) => {
  return ret?.replace(/\%[^\%]+\%/, value || '');
}, 'mongodb://%host%:%port%/%database%') as string;

@Module({
  imports: [MongooseModule.forRoot(dbUrl), ConfigModule, ExecutorModule],
})
export class AppModule {}
