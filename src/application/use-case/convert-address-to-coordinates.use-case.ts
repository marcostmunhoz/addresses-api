import { AddressComponents } from '@/domain/entity/address';
import { AddressFactory } from '@/domain/factory/address.factory';
import type { AddressRepository } from '@/domain/repository/address.repository';
import type { GeocodingService } from '@/domain/service/geocoding.service';
import { Coordinates } from '@/domain/value-object/coordinates.value-object';
import { BaseUseCase } from './base.use-case';
import { AddressNotFoundException } from '@/domain/exception/address-not-found.exception';
import { AddressRepositoryToken, GeocodingServiceToken } from '@/tokens';
import { Inject } from '@nestjs/common';

export type Input = AddressComponents;
export type Output = Coordinates;

export class ConvertAddressToCoordinatesUseCase
  implements BaseUseCase<Input, Output>
{
  constructor(
    private readonly addressFactory: AddressFactory,
    @Inject(AddressRepositoryToken)
    private readonly addressRepository: AddressRepository,
    @Inject(GeocodingServiceToken)
    private readonly geocodingService: GeocodingService,
  ) {}

  async execute(address: Input): Promise<Output> {
    let existingAddress =
      await this.addressRepository.findByComponents(address);

    if (existingAddress?.coordinates) {
      return existingAddress.coordinates;
    }

    const coordinates = await this.geocodingService.getCoordinates({
      ...address,
      zipCode: address.zipCode.value,
      state: address.state.value,
      street: address.street ?? undefined,
      number: address.number ?? undefined,
    });

    if (!coordinates) {
      throw new AddressNotFoundException(address.zipCode.value);
    }

    if (!existingAddress) {
      existingAddress = this.addressFactory.create(address);
    }

    existingAddress.setCoordinates(coordinates);

    await this.addressRepository.save(existingAddress);

    return existingAddress.coordinates as Coordinates;
  }
}
