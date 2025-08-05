import { BaseEntity, EntityProperties } from './base.entity';
import { EntityId } from '../value-object/entity-id.value-object';
import { createFakeEntityId } from '@/testing/domain';

describe('BaseEntity', () => {
  class TestEntity extends BaseEntity<EntityProperties> {}

  it('should return the id via getter', () => {
    // Arrange
    const id: EntityId = createFakeEntityId();
    const entity = new TestEntity({ id });

    // Act
    const result = entity.id;

    // Assert
    expect(result).toBe(id);
  });
});
