import { ErrorCode } from '../enum/error-code.enum';

export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly metadata?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
