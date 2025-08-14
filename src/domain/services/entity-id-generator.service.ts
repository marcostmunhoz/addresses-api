import { EntityId } from '../value-object/entity-id.value-object';

export interface EntityIdGeneratorService {
  generate(): EntityId;
}
