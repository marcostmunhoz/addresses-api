import { mapExceptionToStatusCode } from './exception-to-status-code.mapper';
import { ErrorCode } from '@/domain/enum/error-code.enum';
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@/domain/exception/domain.exception';

const makeDomainException = (code: ErrorCode): unknown => {
  const ex = Object.create(DomainException.prototype);
  (ex as any).code = code;
  return ex;
};

describe('mapExceptionToStatusCode', () => {
  describe('DomainException mapping', () => {
    const domainCases: Array<[ErrorCode, HttpStatus]> = [
      [ErrorCode.ADDRESS_NOT_FOUND, HttpStatus.NOT_FOUND],
      [ErrorCode.VALIDATION_FAILED, HttpStatus.UNPROCESSABLE_ENTITY],
      [ErrorCode.UNHANDLED_ERROR, HttpStatus.INTERNAL_SERVER_ERROR],
    ];

    it.each(domainCases)('should map %s to %s', (code, expectedStatus) => {
      const ex = makeDomainException(code);
      expect(mapExceptionToStatusCode(ex)).toBe(expectedStatus);
    });

    it('should map an unknown domain error code to 500', () => {
      const ex = makeDomainException('UNKNOWN_CODE' as ErrorCode);
      expect(mapExceptionToStatusCode(ex)).toBe(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('Non DomainException mapping (fallback)', () => {
    const nonDomainCases: Array<[string, unknown]> = [
      ['regular Error instance', new Error('any')],
      ['plain object with code', { code: ErrorCode.ADDRESS_NOT_FOUND }],
      ['null', null],
      ['undefined', undefined],
    ];

    it.each(nonDomainCases)('should map %s to 500', (_label, value) => {
      expect(mapExceptionToStatusCode(value)).toBe(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });
});
