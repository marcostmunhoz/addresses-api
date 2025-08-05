import { BaseValueObject } from './base.value-object';

const STATE_REGEX = /^[A-Z]{2}$/;

export class State extends BaseValueObject<string> {
  validate(value: string): void {
    if (!STATE_REGEX.test(value)) {
      throw new Error('Invalid state format.');
    }
  }
}
