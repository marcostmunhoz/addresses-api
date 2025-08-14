import { AddressComponents } from '@/domain/entity/address';
import { AddressFactory } from '@/domain/factory/address.factory';
import { AddressRepository } from '@/domain/repository/address.repository';
import { GeocodingService } from '@/domain/service/geocoding.service';
import { Coordinates } from '@/domain/value-object/coordinates.value-object';
import { BaseUseCase } from './base.use-case';

export type Input = AddressComponents;
export type Output = Coordinates | null;

export class ConvertAddressToCoordinatesUseCase
  implements BaseUseCase<Input, Output>
{
  constructor(
    private readonly addressFactory: AddressFactory,
    private readonly addressRepository: AddressRepository,
    private readonly geocodingService: GeocodingService,
  ) {}

  async execute(address: Input): Promise<Output> {
    let existingAddress =
      await this.addressRepository.findByComponents(address);

    if (existingAddress?.coordinates) {
      return existingAddress.coordinates;
    }

    const coordinates = await this.geocodingService.getCoordinates(address);

    if (!coordinates) {
      return null;
    }

    if (!existingAddress) {
      existingAddress = this.addressFactory.create(address);
    }

    existingAddress.setCoordinates(coordinates);

    await this.addressRepository.save(existingAddress);

    return existingAddress.coordinates;
  }
}
