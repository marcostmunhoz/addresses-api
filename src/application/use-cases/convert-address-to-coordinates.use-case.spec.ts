import { ConvertAddressToCoordinatesUseCase } from './convert-address-to-coordinates.use-case';
import { AddressRepository } from '@/domain/repository/address.repository';
import { GeocodingService } from '@/domain/service/geocoding.service';
import { Address, AddressComponents } from '@/domain/entity/address';
import { State } from '@/domain/value-object/state.value-object';
import { ZipCode } from '@/domain/value-object/zip-code.value-object';
import {
  createAddressRepositoryMock,
  createFakeAddress,
  createFakeAddressComponents,
  createFakeCoordinates,
  createFakeEntityId,
  createGeocodingServiceMock,
} from '@/testing/domain';

describe('ConvertAddressToCoordinatesUseCase', () => {
  let sut: ConvertAddressToCoordinatesUseCase;
  let addressRepositoryMock: jest.Mocked<AddressRepository>;
  let geocodingServiceMock: jest.Mocked<GeocodingService>;
  const fakeCoordinates = createFakeCoordinates();
  const fakeAddressComponents: AddressComponents =
    createFakeAddressComponents();

  beforeEach(() => {
    addressRepositoryMock = createAddressRepositoryMock();
    geocodingServiceMock = createGeocodingServiceMock();
    sut = new ConvertAddressToCoordinatesUseCase(
      addressRepositoryMock,
      geocodingServiceMock,
    );
  });

  it('returns stored coordinates if address exists', async () => {
    // Arrange
    const address: Address = createFakeAddress();
    addressRepositoryMock.findByComponents.mockResolvedValue(address);

    // Act
    const result = await sut.execute(fakeAddressComponents);

    // Assert
    expect(result).toEqual(fakeCoordinates);
    expect(addressRepositoryMock.findByComponents).toHaveBeenCalledWith(
      fakeAddressComponents,
    );
    expect(geocodingServiceMock.getCoordinates).not.toHaveBeenCalled();
  });

  it('returns null if geocoding service returns null', async () => {
    // Arrange
    addressRepositoryMock.findByComponents.mockResolvedValue(null);
    geocodingServiceMock.getCoordinates.mockResolvedValue(null);

    // Act
    const result = await sut.execute(fakeAddressComponents);

    // Assert
    expect(result).toBeNull();
    expect(addressRepositoryMock.findByComponents).toHaveBeenCalledWith(
      fakeAddressComponents,
    );
    expect(geocodingServiceMock.getCoordinates).toHaveBeenCalledWith(
      fakeAddressComponents,
    );
  });

  it('saves and returns new coordinates if address exists without coordinates', async () => {
    // Arrange
    const address: Address = new Address({
      id: createFakeEntityId(),
      ...fakeAddressComponents,
      coordinates: null,
    });
    const updatedAddress: Address = new Address({
      id: address.id,
      ...fakeAddressComponents,
      coordinates: fakeCoordinates,
    });
    addressRepositoryMock.findByComponents.mockResolvedValue(address);
    geocodingServiceMock.getCoordinates.mockResolvedValue(fakeCoordinates);

    // Act
    const result = await sut.execute(fakeAddressComponents);

    // Assert
    expect(result).toEqual(fakeCoordinates);
    expect(addressRepositoryMock.findByComponents).toHaveBeenCalledWith(
      fakeAddressComponents,
    );
    expect(geocodingServiceMock.getCoordinates).toHaveBeenCalledWith(
      fakeAddressComponents,
    );
    expect(addressRepositoryMock.save).toHaveBeenCalledWith(updatedAddress);
  });

  it('creates and returns new address with coordinates if address does not exist', async () => {
    // Arrange
    addressRepositoryMock.findByComponents.mockResolvedValue(null);
    geocodingServiceMock.getCoordinates.mockResolvedValue(fakeCoordinates);
    const createdAddress: Address = new Address({
      id: createFakeEntityId(),
      ...fakeAddressComponents,
      coordinates: fakeCoordinates,
    });
    addressRepositoryMock.create.mockResolvedValue(createdAddress);

    // Act
    const result = await sut.execute(fakeAddressComponents);

    // Assert
    expect(result).toEqual(fakeCoordinates);
    expect(addressRepositoryMock.findByComponents).toHaveBeenCalledWith(
      fakeAddressComponents,
    );
    expect(geocodingServiceMock.getCoordinates).toHaveBeenCalledWith(
      fakeAddressComponents,
    );
    expect(addressRepositoryMock.create).toHaveBeenCalledWith({
      ...fakeAddressComponents,
      coordinates: fakeCoordinates,
    });
  });
});
