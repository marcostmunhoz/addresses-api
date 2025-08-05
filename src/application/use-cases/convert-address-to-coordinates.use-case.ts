import { Address, AddressComponents } from '@/domain/entity/address';
import { AddressRepository } from '@/domain/repository/address.repository';
import { GeocodingService } from '@/domain/service/geocoding.service';
import { Coordinates } from '@/domain/value-object/coordinates.value-object';

export class ConvertAddressToCoordinatesUseCase {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly geocodingService: GeocodingService,
  ) {}

  async execute(address: AddressComponents): Promise<Coordinates | null> {
    const existingAddress =
      await this.addressRepository.findByComponents(address);

    if (existingAddress?.coordinates) {
      return existingAddress.coordinates;
    }

    const coordinates = await this.geocodingService.getCoordinates(address);

    if (!coordinates) {
      return null;
    }

    if (existingAddress) {
      existingAddress.setCoordinates(coordinates);

      await this.addressRepository.save(existingAddress);

      return existingAddress.coordinates;
    }

    const newAddress = await this.addressRepository.create({
      ...address,
      coordinates,
    });

    return newAddress.coordinates;
  }
}
