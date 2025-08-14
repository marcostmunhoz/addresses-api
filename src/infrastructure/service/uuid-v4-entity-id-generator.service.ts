import { EntityIdGeneratorService } from '@/domain/service/entity-id-generator.service';
import { EntityId } from '@/domain/value-object/entity-id.value-object';
import { v4 } from 'uuid';

export class UuidV4EntityIdGeneratorService
  implements EntityIdGeneratorService
{
  generate(): EntityId {
    return new EntityId(v4());
  }
}
