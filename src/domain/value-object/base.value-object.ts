export type ValueObjectValue = unknown;

export abstract class BaseValueObject<TValue extends ValueObjectValue> {
  protected readonly _value: TValue;

  constructor(_value: TValue) {
    const sanitizedValue = this.sanitize(_value);

    this.validate(sanitizedValue);
    this._value = sanitizedValue;
  }

  public get value(): TValue {
    return this._value;
  }

  sanitize(value: TValue): TValue {
    return value;
  }

  abstract validate(value: TValue): void;

  equals(other: BaseValueObject<TValue>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    return this.compareValueWith(other._value);
  }

  protected compareValueWith(other: TValue): boolean {
    return this._value === other;
  }
}
