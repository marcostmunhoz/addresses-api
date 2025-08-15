import { ErrorCode } from '../enum/error-code.enum';
import { DomainException } from './domain.exception';

export class AddressNotFoundException extends DomainException {
  constructor(zipCode: string) {
    super(
      `Address not found for zip code: ${zipCode}`,
      ErrorCode.ADDRESS_NOT_FOUND,
    );
  }
}
