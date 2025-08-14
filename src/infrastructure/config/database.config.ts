import { IsNumber, IsString, Max, Min } from 'class-validator';
import { validate } from './config.validator';
import { registerAs } from '@nestjs/config';

export class DatabaseConfigVariables {
  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;
}

export const DATABASE_CONFIG_PROPS = registerAs('database', () => {
  return validate(
    {
      DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
      DATABASE_PORT: process.env.DATABASE_PORT || 3306,
      DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'addresses',
      DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'addresses',
      DATABASE_NAME: process.env.DATABASE_NAME || 'addresses',
    },
    DatabaseConfigVariables,
  );
});
