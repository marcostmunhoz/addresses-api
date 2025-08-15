import { ErrorCode } from '../enum/error-code.enum';
import { DomainException } from './domain.exception';

export type ValidationErrors = {
  field: string;
  messages: string[];
}[];

export class ValidationFailedException extends DomainException {
  constructor(errors: ValidationErrors) {
    super('Validation failed.', ErrorCode.VALIDATION_FAILED, {
      fields: errors,
    });
  }
}
