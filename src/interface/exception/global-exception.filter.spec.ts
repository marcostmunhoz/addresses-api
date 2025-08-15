import { ArgumentsHost } from '@nestjs/common';
import { ErrorCode } from '@/domain/enum/error-code.enum';
import { DomainException } from '@/domain/exception/domain.exception';
import { mapExceptionToStatusCode } from './exception-to-status-code.mapper';
import { GlobalExceptionFilter } from './global-exception.filter';

jest.mock('./exception-to-status-code.mapper', () => ({
  mapExceptionToStatusCode: jest.fn(),
}));

const makeDomainException = (
  code: ErrorCode,
  message = 'domain error',
  metadata: any = { any: 'meta' },
) => {
  const ex = Object.create(DomainException.prototype);
  (ex as any).code = code;
  (ex as any).message = message;
  (ex as any).metadata = metadata || undefined;
  return ex;
};

const makeHost = (response: any): ArgumentsHost =>
  ({
    switchToHttp: () => ({
      getResponse: () => response,
    }),
  }) as unknown as ArgumentsHost;

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let response: { status: jest.Mock; json: jest.Mock };

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(console, 'log').mockImplementation(() => {});
    (mapExceptionToStatusCode as jest.Mock).mockReset();
  });

  it('should return mapped status and error body for DomainException', () => {
    const ex = makeDomainException(
      ErrorCode.VALIDATION_FAILED,
      'validation failed',
      { field: 'zipCode' },
    );
    (mapExceptionToStatusCode as jest.Mock).mockReturnValue(422);

    filter.catch(ex, makeHost(response));

    expect(mapExceptionToStatusCode).toHaveBeenCalledWith(ex);
    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: ErrorCode.VALIDATION_FAILED,
        message: 'validation failed',
        metadata: { field: 'zipCode' },
      },
    });
  });

  it('should include metadata undefined when DomainException has no metadata', () => {
    const ex = makeDomainException(
      ErrorCode.ADDRESS_NOT_FOUND,
      'not found',
      null,
    );
    (mapExceptionToStatusCode as jest.Mock).mockReturnValue(404);

    filter.catch(ex, makeHost(response));

    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: ErrorCode.ADDRESS_NOT_FOUND,
        message: 'not found',
        metadata: undefined,
      },
    });
  });

  it('should fallback to UNHANDLED_ERROR for non DomainException', () => {
    const ex = new Error('boom');
    (mapExceptionToStatusCode as jest.Mock).mockReturnValue(500);

    filter.catch(ex, makeHost(response));

    expect(mapExceptionToStatusCode).toHaveBeenCalledWith(ex);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: ErrorCode.UNHANDLED_ERROR,
        message: 'An unexpected error occurred.',
        metadata: undefined,
      },
    });
  });

  it('should handle null exception input', () => {
    (mapExceptionToStatusCode as jest.Mock).mockReturnValue(500);

    filter.catch(null as any, makeHost(response));

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: ErrorCode.UNHANDLED_ERROR,
        message: 'An unexpected error occurred.',
        metadata: undefined,
      },
    });
  });
});
