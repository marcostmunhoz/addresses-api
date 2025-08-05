import { BaseValueObject } from './base.value-object';

describe('BaseValueObject', () => {
  class TestValueObject extends BaseValueObject<string> {
    validate(value: string): void {
      if (typeof value !== 'string' || value.length === 0) {
        throw new Error('Invalid value');
      }
    }
  }

  it('should store and return the value', () => {
    // Arrange
    const value = 'foo';

    // Act
    const vo = new TestValueObject(value);

    // Assert
    expect(vo.value).toBe(value);
  });

  it('should throw if value is invalid', () => {
    // Arrange
    const invalid = '';

    // Act & Assert
    expect(() => new TestValueObject(invalid)).toThrow('Invalid value');
  });

  it('should compare equality with another value object', () => {
    // Arrange
    const vo1 = new TestValueObject('bar');
    const vo2 = new TestValueObject('bar');
    const vo3 = new TestValueObject('baz');

    // Act & Assert
    expect(vo1.equals(vo2)).toBe(true);
    expect(vo1.equals(vo3)).toBe(false);
  });

  it('should return false when comparing with null or undefined', () => {
    // Arrange
    const vo = new TestValueObject('foo');

    // Act & Assert
    expect(vo.equals(null as any)).toBe(false);
    expect(vo.equals(undefined as any)).toBe(false);
  });
});
