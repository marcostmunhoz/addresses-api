import { UuidV4EntityIdGeneratorService } from '@/infrastructure/service/uuid-v4-entity-id-generator.service';
import { EntityId } from '@/domain/value-object/entity-id.value-object';
const { v4 } = require('uuid');

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('UuidV4EntityIdGeneratorService', () => {
  let sut: UuidV4EntityIdGeneratorService;

  beforeEach(() => {
    sut = new UuidV4EntityIdGeneratorService();
    jest.clearAllMocks();
  });

  it('should return an EntityId instance', () => {
    // Arrange
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    (v4 as jest.Mock).mockReturnValue(uuid);

    // Act
    const result = sut.generate();

    // Assert
    expect(result).toBeInstanceOf(EntityId);
    expect(result.value).toBe(uuid);
  });

  it('should generate different values on subsequent calls', () => {
    // Arrange
    const uuid1 = '123e4567-e89b-12d3-a456-426614174002';
    const uuid2 = '123e4567-e89b-12d3-a456-426614174003';
    (v4 as jest.Mock).mockReturnValueOnce(uuid1).mockReturnValueOnce(uuid2);

    // Act
    const result1 = sut.generate();
    const result2 = sut.generate();

    // Assert
    expect(result1.value).toBe(uuid1);
    expect(result2.value).toBe(uuid2);
    expect(result1.value).not.toBe(result2.value);
  });
});
