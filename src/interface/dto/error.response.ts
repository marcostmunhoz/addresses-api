import { ErrorCode } from '@/domain/enum/error-code.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ErrorResponseDetails {
  @Expose()
  @ApiProperty({
    enum: ErrorCode,
    example: ErrorCode.UNHANDLED_ERROR,
  })
  code: ErrorCode;

  @Expose()
  @ApiProperty({
    example: 'An unexpected error occurred',
  })
  message: string;

  @Expose()
  @ApiProperty()
  metadata?: Record<string, any> | undefined;
}

export class ErrorResponse {
  @Expose()
  @ApiProperty()
  error: ErrorResponseDetails;
}
