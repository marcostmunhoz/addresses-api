import { Address, AddressProperties } from './address';
import { Coordinates } from '../value-object/coordinates.value-object';
import {
  createFakeCoordinates,
  createFakeEntityId,
  createFakeState,
  createFakeZipCode,
} from '@/testing/domain';
import { EntityId } from '../value-object/entity-id.value-object';
import { ZipCode } from '../value-object/zip-code.value-object';
import { State } from '../value-object/state.value-object';

describe('Address', () => {
  const id: EntityId = createFakeEntityId();
  const zipCode: ZipCode = createFakeZipCode();
  const state: State = createFakeState();
  const city = 'São Paulo';
  const district = 'Centro';
  const street = 'Rua das Flores';
  const number = '123';
  const coordinates: Coordinates = createFakeCoordinates();

  function createAddress(properties: Partial<AddressProperties> = {}) {
    return new Address({
      id,
      zipCode,
      state,
      city,
      district,
      street,
      number,
      coordinates,
      ...properties,
    });
  }

  it('should return all properties via getters', () => {
    // Arrange
    const address = createAddress();

    // Act
    // (getters)
    // Assert
    expect(address.zipCode).toBe(zipCode);
    expect(address.state).toBe(state);
    expect(address.city).toBe(city);
    expect(address.district).toBe(district);
    expect(address.street).toBe(street);
    expect(address.number).toBe(number);
    expect(address.coordinates).toBe(coordinates);
  });

  it('should set street', () => {
    // Arrange
    const address = createAddress({ street: null });
    const newStreet = 'Avenida Paulista';

    // Act
    address.setStreet(newStreet);

    // Assert
    expect(address.street).toBe(newStreet);
  });

  it('should set number', () => {
    // Arrange
    const address = createAddress({ number: null });
    const newNumber = '456';

    // Act
    address.setNumber(newNumber);

    // Assert
    expect(address.number).toBe(newNumber);
  });

  it('should set coordinates', () => {
    // Arrange
    const address = createAddress();
    const newCoordinates = new Coordinates({
      latitude: 40.0,
      longitude: -74.0,
    });

    // Act
    address.setCoordinates(newCoordinates);

    // Assert
    expect(address.coordinates).toBe(newCoordinates);
  });
});
