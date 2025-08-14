import { EntityIdGeneratorServiceToken } from '@/tokens';
import { Inject } from '@nestjs/common';
import type { EntityIdGeneratorService } from '@/domain/services/entity-id-generator.service';
import { Address, AddressComponents } from '@/domain/entity/address';

export class AddressFactory {
  constructor(
    @Inject(EntityIdGeneratorServiceToken)
    private readonly entityIdGenerator: EntityIdGeneratorService,
  ) {}

  create(components: AddressComponents): Address {
    return new Address({
      id: this.entityIdGenerator.generate(),
      coordinates: null,
      ...components,
    });
  }
}
