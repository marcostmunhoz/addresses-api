import { AddressFactory } from './address.factory';
import { Address, AddressComponents } from '@/domain/entity/address';
import type { EntityIdGeneratorService } from '@/domain/service/entity-id-generator.service';
import {
  createFakeAddressComponents,
  createFakeEntityId,
} from '@/testing/domain';

describe('AddressFactory', () => {
  let entityIdGeneratorMock: jest.Mocked<EntityIdGeneratorService>;
  let factory: AddressFactory;

  const fakeId = createFakeEntityId();
  const fakeAddressComponents = createFakeAddressComponents();

  beforeEach(() => {
    entityIdGeneratorMock = {
      generate: jest.fn().mockReturnValue(fakeId),
    };
    factory = new AddressFactory(entityIdGeneratorMock);
  });

  it('creates an Address with generated id and provided components', () => {
    // Act
    const address = factory.create(fakeAddressComponents);

    // Assert
    expect(address).toBeInstanceOf(Address);
    expect(address.id).toBe(fakeId);
    expect(address.zipCode).toBe(fakeAddressComponents.zipCode);
    expect(address.state).toBe(fakeAddressComponents.state);
    expect(address.city).toBe(fakeAddressComponents.city);
    expect(address.district).toBe(fakeAddressComponents.district);
    expect(address.street).toBe(fakeAddressComponents.street);
    expect(address.number).toBe(fakeAddressComponents.number);
    expect(address.coordinates).toBeNull();
    expect(entityIdGeneratorMock.generate).toHaveBeenCalled();
  });
});
