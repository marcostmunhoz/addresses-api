import { TypeOrmAddressRepository } from './typeorm-address.repository';
import { Repository } from 'typeorm';
import { TypeOrmAddressModel } from '../model/typeorm-address.model';
import {
  createFakeEntityId,
  createFakeZipCode,
  createFakeState,
  createFakeCoordinates,
  createFakeAddressComponents,
} from '@/testing/domain';
import { Address, AddressComponents } from '@/domain/entity/address';

describe('TypeOrmAddressRepository', () => {
  let repository: jest.Mocked<Repository<TypeOrmAddressModel>>;
  let sut: TypeOrmAddressRepository;

  const fakeEntityId = createFakeEntityId();
  const fakeZipCode = createFakeZipCode();
  const fakeState = createFakeState();
  const fakeCoordinates = createFakeCoordinates();
  const fakeAddressComponents: AddressComponents =
    createFakeAddressComponents();
  const fakeModel: TypeOrmAddressModel = {
    id: fakeEntityId.value,
    zipCode: fakeZipCode.value,
    state: fakeState.value,
    city: fakeAddressComponents.city,
    district: fakeAddressComponents.district,
    street: fakeAddressComponents.street || undefined,
    number: fakeAddressComponents.number || undefined,
    latitude: fakeCoordinates.value.latitude,
    longitude: fakeCoordinates.value.longitude,
  };

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;
    sut = new TypeOrmAddressRepository(repository);
  });

  describe('findByComponents', () => {
    it('returns null if address is not found with given components', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await sut.findByComponents(fakeAddressComponents);

      // Assert
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          zipCode: fakeZipCode.value,
          state: fakeState.value,
          city: fakeAddressComponents.city,
          district: fakeAddressComponents.district,
          street: fakeAddressComponents.street,
          number: fakeAddressComponents.number,
        },
      });
    });

    it('returns Address if address is found', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(fakeModel);

      // Act
      const result = await sut.findByComponents(fakeAddressComponents);

      // Assert
      expect(result).toBeInstanceOf(Address);
      expect(result?.id.value).toBe(fakeEntityId.value);
      expect(result?.zipCode.value).toBe(fakeZipCode.value);
      expect(result?.state.value).toBe(fakeState.value);
      expect(result?.coordinates?.value.latitude).toBe(
        fakeCoordinates.value.latitude,
      );
      expect(result?.coordinates?.value.longitude).toBe(
        fakeCoordinates.value.longitude,
      );
    });
  });

  describe('save', () => {
    it('calls repository.save with mapped model', async () => {
      // Arrange
      const address = new Address({
        id: fakeEntityId,
        zipCode: fakeZipCode,
        state: fakeState,
        city: 'São Paulo',
        district: 'Centro',
        street: 'Rua das Flores',
        number: '123',
        coordinates: fakeCoordinates,
      });
      repository.save.mockResolvedValue(fakeModel);

      // Act
      await sut.save(address);

      // Assert
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: fakeEntityId.value,
          zipCode: fakeZipCode.value,
          state: fakeState.value,
          city: 'São Paulo',
          district: 'Centro',
          street: 'Rua das Flores',
          number: '123',
          latitude: fakeCoordinates.value.latitude,
          longitude: fakeCoordinates.value.longitude,
        }),
      );
    });
  });
});
