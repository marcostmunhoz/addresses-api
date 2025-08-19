import { AddressComponents } from '@/domain/entity/address';
import {
  GeocodingService,
  GeocodingServiceAddressComponents,
} from '@/domain/service/geocoding.service';
import { Coordinates } from '@/domain/value-object/coordinates.value-object';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

export type GoogleGeocodingAPISuccessResponse = {
  status: 'OK';
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
};

export type GoogleGeocodingAPIErrorResponse = {
  status:
    | 'ZERO_RESULTS'
    | 'OVER_DAILY_LIMIT'
    | 'OVER_QUERY_LIMIT'
    | 'REQUEST_DENIED'
    | 'INVALID_REQUEST'
    | 'UNKNOWN_ERROR';
  error_message?: string;
};

export class GoogleAPIGeocodingService implements GeocodingService {
  constructor(
    private readonly httpService: HttpService,
    private readonly apiKey: string,
  ) {}

  async getCoordinates(
    address: GeocodingServiceAddressComponents,
  ): Promise<Coordinates | null> {
    const promise = firstValueFrom(
      this.httpService.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            address: this.normalizeAddress(address),
            key: this.apiKey,
            language: 'pt-BR',
          },
        },
      ),
    );

    const response: AxiosResponse<
      GoogleGeocodingAPISuccessResponse | GoogleGeocodingAPIErrorResponse
    > = await promise;

    this.handleErrors(response);

    const result = (response.data as GoogleGeocodingAPISuccessResponse)
      ?.results[0];

    if (!result) {
      return null;
    }

    const { lat, lng } = result.geometry.location;

    return new Coordinates({ latitude: lat, longitude: lng });
  }

  private normalizeAddress(address: GeocodingServiceAddressComponents): string {
    const { state, city, district, street, number } = address;
    const formattedZipCode = address.zipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
    let formattedAddress = `${district}, ${city}/${state} - ${formattedZipCode} - Brasil`;

    if (street && number) {
      return `${street}, ${number}, ${formattedAddress}`;
    } else if (street) {
      return `${street}, ${formattedAddress}`;
    }

    return formattedAddress;
  }

  private handleErrors(
    response: AxiosResponse<
      GoogleGeocodingAPISuccessResponse | GoogleGeocodingAPIErrorResponse
    >,
  ) {
    const status = response.data?.status;

    if (status === 'OK') {
      return;
    }

    const message = response.data?.error_message || 'Unknown error';

    throw new Error(
      `Google Geocoding API responded with error code ${status} and message: ${message}`,
    );
  }
}
