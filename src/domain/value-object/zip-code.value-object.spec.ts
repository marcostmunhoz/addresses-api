import { ZipCode } from './zip-code.value-object';

describe('ZipCode', () => {
  it('should create a valid ZipCode', () => {
    // Arrange
    const input = '12345-678';

    // Act
    const zip = new ZipCode(input);

    // Assert
    expect(zip.value).toBe('12345678');
  });

  it('should throw for invalid format', () => {
    // Arrange
    const tooShort = '1234';
    const notDigits = 'abcdefgh';

    // Act & Assert
    expect(() => new ZipCode(tooShort)).toThrow('Invalid zip code format.');
    expect(() => new ZipCode(notDigits)).toThrow('Invalid zip code format.');
  });

  it('should throw for empty string', () => {
    // Arrange
    const empty = '';

    // Act & Assert
    expect(() => new ZipCode(empty)).toThrow('Invalid zip code format.');
  });
});
