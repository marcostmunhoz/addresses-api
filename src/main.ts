import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  APP_CONFIG_PROPS,
  AppConfigVariables,
  Environment,
} from './infrastructure/config/app.config';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const configureApp = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });
};

const setupSwagger = (app: INestApplication, appConfig: AppConfigVariables) => {
  const config = new DocumentBuilder()
    .setTitle('Addresses API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    ui: appConfig.NODE_ENV === Environment.LOCAL,
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: AppConfigVariables = app.get(APP_CONFIG_PROPS.KEY);

  configureApp(app);
  setupSwagger(app, appConfig);

  await app.listen(appConfig.APP_PORT);
}
bootstrap();
