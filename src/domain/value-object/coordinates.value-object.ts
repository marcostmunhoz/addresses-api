import { BaseValueObject } from './base.value-object';

export type CoordinatesValue = {
  latitude: number;
  longitude: number;
};

export class Coordinates extends BaseValueObject<CoordinatesValue> {
  validate(value: CoordinatesValue): void {
    if (
      !this.isNumeric(value.latitude) ||
      !this.isNumeric(value.longitude) ||
      isNaN(value.latitude) ||
      isNaN(value.longitude) ||
      Math.abs(value.latitude) > 90 ||
      Math.abs(value.longitude) > 180
    ) {
      throw new Error('Invalid coordinates.');
    }
  }

  sanitize(value: CoordinatesValue): CoordinatesValue {
    return {
      latitude: Number(Number(value.latitude).toFixed(6)),
      longitude: Number(Number(value.longitude).toFixed(6)),
    };
  }

  private isNumeric(value: any): boolean {
    if (typeof value === 'number') {
      return true;
    }

    return typeof value === 'string' && !isNaN(Number(value));
  }
}
