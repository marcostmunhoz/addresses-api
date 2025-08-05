import { EntityId } from './entity-id.value-object';

describe('EntityId', () => {
  it('should create a valid EntityId', () => {
    // Arrange
    const validId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

    // Act
    const id = new EntityId(validId);

    // Assert
    expect(id.value).toBe(validId);
  });

  it('should throw for invalid format', () => {
    // Arrange
    const invalidId = 'invalid-id';

    // Act & Assert
    expect(() => new EntityId(invalidId)).toThrow('Invalid entity ID format.');
  });

  it('should throw for empty string', () => {
    // Arrange
    const empty = '';

    // Act & Assert
    expect(() => new EntityId(empty)).toThrow('Invalid entity ID format.');
  });
});
