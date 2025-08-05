import { Coordinates } from './coordinates.value-object';

describe('Coordinates', () => {
  it('should create valid coordinates', () => {
    // Arrange
    const latitude = 45.0;
    const longitude = 90.0;

    // Act
    const coords = new Coordinates({ latitude, longitude });

    // Assert
    expect(coords.value.latitude).toBe(latitude);
    expect(coords.value.longitude).toBe(longitude);
  });

  it('should throw for invalid latitude', () => {
    // Arrange
    const invalidLatitude = 100;
    const longitude = 0;

    // Act & Assert
    expect(
      () => new Coordinates({ latitude: invalidLatitude, longitude }),
    ).toThrow('Invalid coordinates.');
  });

  it('should throw for invalid longitude', () => {
    // Arrange
    const latitude = 0;
    const invalidLongitude = 200;

    // Act & Assert
    expect(
      () => new Coordinates({ latitude, longitude: invalidLongitude }),
    ).toThrow('Invalid coordinates.');
  });

  it('should throw for NaN values', () => {
    // Arrange
    const valid = 0;
    const nan = NaN;

    // Act & Assert
    expect(() => new Coordinates({ latitude: nan, longitude: valid })).toThrow(
      'Invalid coordinates.',
    );
    expect(() => new Coordinates({ latitude: valid, longitude: nan })).toThrow(
      'Invalid coordinates.',
    );
  });
});
