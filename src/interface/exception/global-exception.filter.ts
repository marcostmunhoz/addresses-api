import { ArgumentsHost, ExceptionFilter, Injectable } from '@nestjs/common';
import { mapExceptionToStatusCode } from './exception-to-status-code.mapper';
import { Response } from 'express';
import { DomainException } from '@/domain/exception/domain.exception';
import { ErrorResponse } from '../dto/error.response';
import { ErrorCode } from '@/domain/enum/error-code.enum';

@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.error('[GlobalExceptionFilter] Caught exception:', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = mapExceptionToStatusCode(exception);

    response
      .status(statusCode)
      .json(this.convertExceptionToResponse(exception));
  }

  private convertExceptionToResponse(exception: unknown): ErrorResponse {
    let code = ErrorCode.UNHANDLED_ERROR;
    let message = 'An unexpected error occurred.';
    let metadata: Record<string, any> | undefined = undefined;

    if (exception instanceof DomainException) {
      code = exception.code;
      message = exception.message;
      metadata = exception.metadata;
    }

    return {
      error: {
        code,
        message,
        metadata,
      },
    };
  }
}
