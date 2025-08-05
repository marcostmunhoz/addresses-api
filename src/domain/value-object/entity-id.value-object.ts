import { BaseValueObject } from './base.value-object';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class EntityId extends BaseValueObject<string> {
  validate(value: string): void {
    if (!UUID_REGEX.test(value)) {
      throw new Error('Invalid entity ID format.');
    }
  }
}
