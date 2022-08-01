import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ApplicationBuilder, ApplicationDirector } from '@shayan/common';

import { AppModule } from './app-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const builder = new ApplicationBuilder(app, app.select(AppModule));
  const director = new ApplicationDirector(builder);
  await director.create({
    enableGlobalPermissionInterceptor: false,
    swagger: {},
  });

  await app.listen(process.env.PORT || '3000');
}
bootstrap();
