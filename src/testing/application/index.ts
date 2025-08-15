import { ConvertAddressToCoordinatesUseCase } from '@/application/use-case/convert-address-to-coordinates.use-case';

export const createConvertAddressToCoordinatesUseCaseMock =
  (): jest.Mocked<ConvertAddressToCoordinatesUseCase> =>
    ({
      execute: jest.fn(),
    }) as unknown as jest.Mocked<ConvertAddressToCoordinatesUseCase>;
