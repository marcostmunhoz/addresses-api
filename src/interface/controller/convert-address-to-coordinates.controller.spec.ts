import { EntityId } from '@/domain/value-object/entity-id.value-object';
import { ConvertAddressToCoordinatesController } from './convert-address-to-coordinates.controller';
import {
  ConvertAddressToCoordinatesUseCase,
  Input,
} from '@/application/use-case/convert-address-to-coordinates.use-case';
import { createConvertAddressToCoordinatesUseCaseMock } from '@/testing/application';
import {
  createFakeAddressComponents,
  createFakeCoordinates,
} from '@/testing/domain';
import { ConvertAddressToCoordinatesRequest } from '../dto/convert-address-to-coordinates.request';

describe('ConvertAddressToCoordinatesController', () => {
  let convertAddressToCoordinatesUseCaseMock: jest.Mocked<ConvertAddressToCoordinatesUseCase>;
  let sut: ConvertAddressToCoordinatesController;

  beforeEach(() => {
    convertAddressToCoordinatesUseCaseMock =
      createConvertAddressToCoordinatesUseCaseMock();
    sut = new ConvertAddressToCoordinatesController(
      convertAddressToCoordinatesUseCaseMock,
    );
  });

  it('should return the coordinates for a valid address', async () => {
    // Arrange
    const address = createFakeAddressComponents();
    const { zipCode, state, ...remainingProps } = address;
    const coordinates = createFakeCoordinates();
    convertAddressToCoordinatesUseCaseMock.execute.mockResolvedValue(
      coordinates,
    );

    // Act
    const result = await sut.execute({
      zipCode: zipCode.value,
      state: state.value,
      ...remainingProps,
    });

    // Assert
    expect(result).toEqual({
      lat: coordinates.value.latitude,
      lng: coordinates.value.longitude,
    });
    expect(convertAddressToCoordinatesUseCaseMock.execute).toHaveBeenCalledWith(
      address,
    );
  });
});
