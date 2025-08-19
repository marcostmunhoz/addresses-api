import { Coordinates } from '../value-object/coordinates.value-object';

export type GeocodingServiceAddressComponents = {
  street?: string;
  number?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
};

export interface GeocodingService {
  getCoordinates(
    address: GeocodingServiceAddressComponents,
  ): Promise<Coordinates | null>;
}
