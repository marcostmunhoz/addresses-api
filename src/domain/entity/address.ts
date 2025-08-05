import { Coordinates } from '../value-object/coordinates.value-object';
import { EntityId } from '../value-object/entity-id.value-object';
import { State } from '../value-object/state.value-object';
import { ZipCode } from '../value-object/zip-code.value-object';
import { BaseEntity } from './base.entity';

export type AddressProperties = {
  id: EntityId;
  zipCode: ZipCode;
  state: State;
  city: string;
  district: string;
  street: string | null;
  number: string | null;
  coordinates: Coordinates | null;
};

export type AddressComponents = Pick<
  AddressProperties,
  'zipCode' | 'state' | 'city' | 'district' | 'street' | 'number'
>;

export class Address extends BaseEntity<AddressProperties> {
  public get zipCode(): ZipCode {
    return this._properties.zipCode;
  }

  public get state(): State {
    return this._properties.state;
  }

  public get city(): string {
    return this._properties.city;
  }

  public get district(): string {
    return this._properties.district;
  }

  public get street(): string | null {
    return this._properties.street;
  }

  public setStreet(street: string): void {
    this._properties.street = street;
  }

  public get number(): string | null {
    return this._properties.number;
  }

  public setNumber(number: string): void {
    this._properties.number = number;
  }

  public get coordinates(): Coordinates | null {
    return this._properties.coordinates;
  }

  public setCoordinates(coordinates: Coordinates): void {
    this._properties.coordinates = coordinates;
  }
}
