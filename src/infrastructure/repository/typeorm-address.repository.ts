import { Address, AddressComponents } from '@/domain/entity/address';
import { AddressRepository } from '@/domain/repository/address.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmAddressModel } from '../model/typeorm-address.model';
import { Repository } from 'typeorm';
import { EntityId } from '@/domain/value-object/entity-id.value-object';
import { ZipCode } from '@/domain/value-object/zip-code.value-object';
import { State } from '@/domain/value-object/state.value-object';
import { Coordinates } from '@/domain/value-object/coordinates.value-object';

export class TypeOrmAddressRepository implements AddressRepository {
  constructor(
    @InjectRepository(TypeOrmAddressModel)
    private readonly repository: Repository<TypeOrmAddressModel>,
  ) {}

  async findByComponents(
    components: AddressComponents,
  ): Promise<Address | null> {
    const address = await this.repository.findOne({
      where: {
        zipCode: components.zipCode.value,
        state: components.state.value,
        city: components.city,
        district: components.district,
        street: components.street || undefined,
        number: components.number || undefined,
      },
    });

    if (!address) {
      return null;
    }

    return this.mapModelToEntity(address);
  }

  async save(address: Address): Promise<void> {
    await this.repository.save(this.mapEntityToModel(address));
  }

  private mapModelToEntity(model: TypeOrmAddressModel): Address {
    return new Address({
      id: new EntityId(model.id),
      zipCode: new ZipCode(model.zipCode),
      state: new State(model.state),
      city: model.city,
      district: model.district,
      street: model.street || null,
      number: model.number || null,
      coordinates:
        model.latitude && model.longitude
          ? new Coordinates({
              latitude: model.latitude,
              longitude: model.longitude,
            })
          : null,
    });
  }

  private mapEntityToModel(address: Address): TypeOrmAddressModel {
    return {
      id: address.id.value,
      zipCode: address.zipCode.value,
      state: address.state.value,
      city: address.city,
      district: address.district,
      street: address.street || null,
      number: address.number || null,
      latitude: address.coordinates?.value.latitude || null,
      longitude: address.coordinates?.value.longitude || null,
    } as TypeOrmAddressModel;
  }
}
