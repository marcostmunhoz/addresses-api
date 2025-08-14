import { ConvertAddressToCoordinatesUseCase } from './convert-address-to-coordinates.use-case';
import { AddressRepository } from '@/domain/repository/address.repository';
import { GeocodingService } from '@/domain/service/geocoding.service';
import { Address, AddressComponents } from '@/domain/entity/address';
import {
  createAddressFactoryMock,
  createAddressRepositoryMock,
  createFakeAddress,
  createFakeAddressComponents,
  createFakeCoordinates,
  createFakeEntityId,
  createGeocodingServiceMock,
} from '@/testing/domain';
import { AddressFactory } from '@/domain/factory/address.factory';

describe('ConvertAddressToCoordinatesUseCase', () => {
  let sut: ConvertAddressToCoordinatesUseCase;
  let addressFactoryMock: jest.Mocked<AddressFactory>;
  let addressRepositoryMock: jest.Mocked<AddressRepository>;
  let geocodingServiceMock: jest.Mocked<GeocodingService>;
  const fakeCoordinates = createFakeCoordinates();
  const fakeAddressComponents: AddressComponents =
    createFakeAddressComponents();

  beforeEach(() => {
    addressFactoryMock = createAddressFactoryMock();
    addressRepositoryMock = createAddressRepositoryMock();
    geocodingServiceMock = createGeocodingServiceMock();
    sut = new ConvertAddressToCoordinatesUseCase(
      addressFactoryMock,
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

  it('creates a new Address instance and saves it when it does not exist', async () => {
    // Arrange
    addressRepositoryMock.findByComponents.mockResolvedValue(null);
    geocodingServiceMock.getCoordinates.mockResolvedValue(fakeCoordinates);
    addressFactoryMock.create.mockReturnValue(createFakeAddress());

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
    expect(addressFactoryMock.create).toHaveBeenCalledWith(
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
});
