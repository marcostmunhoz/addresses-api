import {
  GoogleAPIGeocodingService,
  GoogleGeocodingAPISuccessResponse,
  GoogleGeocodingAPIErrorResponse,
} from './google-api-geocoding.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { Coordinates } from '@/domain/value-object/coordinates.value-object';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { GeocodingServiceAddressComponents } from '@/domain/service/geocoding.service';

describe('GoogleAPIGeocodingService', () => {
  let httpService: jest.Mocked<HttpService>;
  let sut: GoogleAPIGeocodingService;

  const apiKey = 'FAKE_API_KEY';

  const makeAxiosResponse = <
    T extends
      | GoogleGeocodingAPISuccessResponse
      | GoogleGeocodingAPIErrorResponse,
  >(
    data: T,
  ): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  });

  beforeEach(() => {
    httpService = {
      get: jest.fn(),
    } as any;
    sut = new GoogleAPIGeocodingService(httpService, apiKey);
    jest.clearAllMocks();
  });

  const fullAddress: GeocodingServiceAddressComponents = {
    zipCode: '01001000',
    state: 'SP',
    city: 'São Paulo',
    district: 'Sé',
    street: 'Praça da Sé',
    number: '1',
  };

  it('returns Coordinates on successful response with at least one result', async () => {
    // Arrange
    const response: GoogleGeocodingAPISuccessResponse = {
      status: 'OK',
      results: [
        {
          geometry: {
            location: { lat: -23.55, lng: -46.63 },
          },
        },
      ],
    };
    httpService.get.mockReturnValue(of(makeAxiosResponse(response)));

    // Act
    const result = await sut.getCoordinates(fullAddress);

    // Assert
    expect(result).toBeInstanceOf(Coordinates);
    expect(result?.value.latitude).toBe(-23.55);
    expect(result?.value.longitude).toBe(-46.63);
    expect(httpService.get).toHaveBeenCalledWith(
      'https://maps.googleapis.com/maps/api/geocode/json',
      expect.objectContaining({
        params: expect.objectContaining({
          address: 'Praça da Sé, 1, Sé, São Paulo/SP - 01001-000 - Brasil',
          key: apiKey,
          language: 'pt-BR',
        }),
      }),
    );
  });

  it('returns null when API returns OK with empty results', async () => {
    // Arrange
    const response: GoogleGeocodingAPISuccessResponse = {
      status: 'OK',
      results: [],
    };
    httpService.get.mockReturnValue(of(makeAxiosResponse(response)));

    // Act
    const result = await sut.getCoordinates(fullAddress);

    // Assert
    expect(result).toBeNull();
  });

  it('throws generic error when API returns non-OK status', async () => {
    // Arrange
    const response: GoogleGeocodingAPIErrorResponse = {
      status: 'OVER_QUERY_LIMIT',
      error_message: 'Quota exceeded',
    };
    let error: Error | undefined;
    httpService.get.mockReturnValue(of(makeAxiosResponse(response)));

    // Act
    try {
      await sut.getCoordinates(fullAddress);
    } catch (err: any) {
      error = err;
    }

    // Assert
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe(
      'Google Geocoding API responded with error code OVER_QUERY_LIMIT and message: Quota exceeded',
    );
  });

  it('normalizes address with only street (no number)', async () => {
    // Arrange
    const partial: GeocodingServiceAddressComponents = {
      ...fullAddress,
      number: undefined,
    };
    const response: GoogleGeocodingAPISuccessResponse = {
      status: 'OK',
      results: [],
    };
    httpService.get.mockReturnValue(of(makeAxiosResponse(response)));

    // Act
    await sut.getCoordinates(partial);

    // Assert
    expect(httpService.get).toHaveBeenCalledWith(
      'https://maps.googleapis.com/maps/api/geocode/json',
      expect.objectContaining({
        params: expect.objectContaining({
          address: 'Praça da Sé, Sé, São Paulo/SP - 01001-000 - Brasil',
        }),
      }),
    );
  });

  it('normalizes address without street and number', async () => {
    // Arrange
    const partial: GeocodingServiceAddressComponents = {
      ...fullAddress,
      street: undefined,
      number: undefined,
    };
    const response: GoogleGeocodingAPISuccessResponse = {
      status: 'OK',
      results: [],
    };
    httpService.get.mockReturnValue(of(makeAxiosResponse(response)));

    // Act
    await sut.getCoordinates(partial);

    // Assert
    expect(httpService.get).toHaveBeenCalledWith(
      'https://maps.googleapis.com/maps/api/geocode/json',
      expect.objectContaining({
        params: expect.objectContaining({
          address: 'Sé, São Paulo/SP - 01001-000 - Brasil',
        }),
      }),
    );
  });
});
