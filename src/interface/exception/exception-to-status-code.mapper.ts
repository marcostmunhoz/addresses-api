import { ErrorCode } from '@/domain/enum/error-code.enum';
import { DomainException } from '@/domain/exception/domain.exception';
import { HttpStatus } from '@nestjs/common';

export const mapExceptionToStatusCode = (exception: unknown): HttpStatus => {
  const errorCode: ErrorCode =
    exception instanceof DomainException
      ? exception.code
      : ErrorCode.UNHANDLED_ERROR;

  switch (errorCode) {
    case ErrorCode.ADDRESS_NOT_FOUND:
      return HttpStatus.NOT_FOUND;
    case ErrorCode.VALIDATION_FAILED:
      return HttpStatus.UNPROCESSABLE_ENTITY;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
};
