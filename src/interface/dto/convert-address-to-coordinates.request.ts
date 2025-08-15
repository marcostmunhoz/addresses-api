import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class ConvertAddressToCoordinatesRequest {
  @ApiProperty({
    example: '01001-000',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/)
  zipCode: string;

  @ApiProperty({
    example: 'SP',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]{2}$/)
  state: string;

  @ApiProperty({
    example: 'São Paulo',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    example: 'Praça da Sé',
  })
  @IsNotEmpty()
  @IsString()
  district: string;

  @ApiProperty({
    example: 'Sé',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  street: string | null;

  @ApiProperty({
    example: '123',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  number: string | null;
}
