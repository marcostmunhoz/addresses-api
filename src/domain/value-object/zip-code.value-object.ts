import { BaseValueObject } from './base.value-object';

const ZIP_CODE_SANITIZATION_REGEX = /\D/g;
const ZIP_CODE_VALIDATION_REGEX = /^\d{8}$/;

export class ZipCode extends BaseValueObject<string> {
  sanitize(value: string): string {
    return value.replace(ZIP_CODE_SANITIZATION_REGEX, '');
  }

  validate(value: string): void {
    if (!ZIP_CODE_VALIDATION_REGEX.test(value)) {
      throw new Error('Invalid zip code format.');
    }
  }
}
