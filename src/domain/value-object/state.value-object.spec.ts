import { State } from './state.value-object';

describe('State', () => {
  it('should create a valid State', () => {
    // Arrange
    const valid = 'SP';

    // Act
    const state = new State(valid);

    // Assert
    expect(state.value).toBe(valid);
  });

  it('should throw for invalid format', () => {
    // Arrange
    const tooShort = 'S';
    const lowercase = 'sp';
    const numbers = '123';

    // Act & Assert
    expect(() => new State(tooShort)).toThrow('Invalid state format.');
    expect(() => new State(lowercase)).toThrow('Invalid state format.');
    expect(() => new State(numbers)).toThrow('Invalid state format.');
  });

  it('should throw for empty string', () => {
    // Arrange
    const empty = '';

    // Act & Assert
    expect(() => new State(empty)).toThrow('Invalid state format.');
  });
});
