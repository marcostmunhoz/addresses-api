import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { validate } from './config.validator';
import { registerAs } from '@nestjs/config';

export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  HOMOLOG = 'homolog',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

export class AppConfigVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  APP_PORT: number;
}

export const APP_CONFIG_PROPS = registerAs('app', () => {
  return validate(
    {
      NODE_ENV: process.env.NODE_ENV || Environment.LOCAL,
      APP_PORT: process.env.APP_PORT || 3000,
    },
    AppConfigVariables,
  );
});
