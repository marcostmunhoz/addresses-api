import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../dto/error.response';
import { ErrorCode } from '@/domain/enum/error-code.enum';

export const DefaultApiValidationErrorResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 422,
      type: ErrorResponse,
      example: {
        error: {
          code: ErrorCode.VALIDATION_FAILED,
          message: 'Validation failed.',
          metadata: {
            fields: [
              {
                field: 'someField',
                messages: ['Some error message'],
              },
            ],
          },
        },
      },
    }),
  );
