import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validate = <TConfig = object>(
  config: Record<string, any>,
  constructor: ClassConstructor<TConfig>,
): TConfig => {
  const instance = plainToInstance(constructor, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(instance as object, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors}`);
  }

  return instance;
};
