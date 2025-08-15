import { GeocodingService } from '@/domain/service/geocoding.service';
import { Coordinates } from '@/domain/value-object/coordinates.value-object';

export class FakeGeocodingService implements GeocodingService {
  async getCoordinates(): Promise<Coordinates> {
    const lat = Math.random() * 180 - 90;
    const lng = Math.random() * 360 - 180;

    return new Coordinates({ latitude: lat, longitude: lng });
  }
}
