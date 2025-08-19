import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
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

  @IsOptional()
  @IsString()
  GOOGLE_API_GEOCODING_KEY: string;
}

export const APP_CONFIG_PROPS = registerAs('app', () => {
  return validate(
    {
      NODE_ENV: process.env.NODE_ENV || Environment.LOCAL,
      APP_PORT: process.env.APP_PORT || 3000,
      GOOGLE_API_GEOCODING_KEY: process.env.GOOGLE_API_GEOCODING_KEY,
    },
    AppConfigVariables,
  );
});
