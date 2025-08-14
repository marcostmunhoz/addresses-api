import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  APP_CONFIG_PROPS,
  AppConfigVariables,
} from './infrastructure/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigVariables = app.get(APP_CONFIG_PROPS.KEY);

  await app.listen(appConfig.APP_PORT);
}
bootstrap();
