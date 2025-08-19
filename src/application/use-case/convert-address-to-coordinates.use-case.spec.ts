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
import { AddressNotFoundException } from '@/domain/exception/address-not-found.exception';

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

  it('throws AddressNotFoundException if geocoding service returns null', async () => {
    // Arrange
    addressRepositoryMock.findByComponents.mockResolvedValue(null);
    geocodingServiceMock.getCoordinates.mockResolvedValue(null);

    // Act
    const assertion = async () => await sut.execute(fakeAddressComponents);

    // Assert
    expect(assertion).rejects.toThrow(AddressNotFoundException);
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
    expect(geocodingServiceMock.getCoordinates).toHaveBeenCalledWith({
      street: fakeAddressComponents.street,
      number: fakeAddressComponents.number,
      district: fakeAddressComponents.district,
      city: fakeAddressComponents.city,
      state: fakeAddressComponents.state.value,
      zipCode: fakeAddressComponents.zipCode.value,
    });
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
    expect(geocodingServiceMock.getCoordinates).toHaveBeenCalledWith({
      street: fakeAddressComponents.street,
      number: fakeAddressComponents.number,
      district: fakeAddressComponents.district,
      city: fakeAddressComponents.city,
      state: fakeAddressComponents.state.value,
      zipCode: fakeAddressComponents.zipCode.value,
    });
    expect(addressRepositoryMock.save).toHaveBeenCalledWith(updatedAddress);
  });
});
