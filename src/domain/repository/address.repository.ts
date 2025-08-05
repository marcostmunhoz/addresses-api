import {
  Address,
  AddressComponents,
  AddressProperties,
} from '../entity/address';

export type AddressData = Omit<AddressProperties, 'id'>;

export interface AddressRepository {
  findByComponents(address: AddressComponents): Promise<Address | null>;
  create(address: AddressData): Promise<Address>;
  save(address: Address): Promise<void>;
}
