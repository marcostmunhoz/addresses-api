import { DomainException } from './domain.exception';

export class AddressNotFoundException extends DomainException {
  constructor(zipCode: string) {
    super(`Address not found for zip code: ${zipCode}`);
  }
}
