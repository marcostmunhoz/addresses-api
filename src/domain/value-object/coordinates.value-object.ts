import { BaseValueObject } from './base.value-object';

export type CoordinatesValue = {
  latitude: number;
  longitude: number;
};

export class Coordinates extends BaseValueObject<CoordinatesValue> {
  validate(value: CoordinatesValue): void {
    if (
      typeof value.latitude !== 'number' ||
      typeof value.longitude !== 'number' ||
      isNaN(value.latitude) ||
      isNaN(value.longitude) ||
      Math.abs(value.latitude) > 90 ||
      Math.abs(value.longitude) > 180
    ) {
      throw new Error('Invalid coordinates.');
    }
  }
}
