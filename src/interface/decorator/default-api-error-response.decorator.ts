import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../dto/error.response';

export const DefaultApiErrorResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 500,
      type: ErrorResponse,
    }),
  );
