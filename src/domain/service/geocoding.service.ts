import { AddressComponents } from '../entity/address';
import { Coordinates } from '../value-object/coordinates.value-object';

export interface GeocodingService {
  getCoordinates(address: AddressComponents): Promise<Coordinates | null>;
}
