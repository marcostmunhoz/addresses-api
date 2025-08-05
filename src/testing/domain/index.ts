import { Address, AddressComponents } from '@/domain/entity/address';
import { AddressRepository } from '@/domain/repository/address.repository';
import { GeocodingService } from '@/domain/service/geocoding.service';
import { Coordinates } from '@/domain/value-object/coordinates.value-object';
import { EntityId } from '@/domain/value-object/entity-id.value-object';
import { State } from '@/domain/value-object/state.value-object';
import { ZipCode } from '@/domain/value-object/zip-code.value-object';

export const createAddressRepositoryMock = (): jest.Mocked<AddressRepository> =>
  ({
    findByComponents: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  }) as unknown as jest.Mocked<AddressRepository>;

export const createGeocodingServiceMock = (): jest.Mocked<GeocodingService> =>
  ({
    getCoordinates: jest.fn(),
  }) as unknown as jest.Mocked<GeocodingService>;

export const createFakeEntityId = (): EntityId => {
  return new EntityId('11111111-2222-3333-4444-555555555555');
};

export const createFakeZipCode = (): ZipCode => {
  return new ZipCode('01001000');
};

export const createFakeState = (): State => {
  return new State('SP');
};

export const createFakeCoordinates = (): Coordinates => {
  return new Coordinates({ latitude: 90.0, longitude: 180.0 });
};

export const createFakeAddressComponents = (): AddressComponents => {
  return {
    street: 'Praça da Sé',
    number: '1',
    district: 'Sé',
    city: 'São Paulo',
    state: createFakeState(),
    zipCode: createFakeZipCode(),
  };
};

export const createFakeAddress = (): Address => {
  return new Address({
    id: createFakeEntityId(),
    ...createFakeAddressComponents(),
    coordinates: createFakeCoordinates(),
  });
};
