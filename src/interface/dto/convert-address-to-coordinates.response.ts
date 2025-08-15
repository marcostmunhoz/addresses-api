import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ConvertAddressToCoordinatesResponse {
  @Expose()
  @ApiProperty({
    example: 40.7128,
  })
  lat: number;

  @Expose()
  @ApiProperty({
    example: -74.006,
  })
  lng: number;
}
