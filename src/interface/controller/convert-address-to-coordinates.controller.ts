import { ConvertAddressToCoordinatesUseCase } from '@/application/use-case/convert-address-to-coordinates.use-case';
import { Controller, Get, HttpCode, Query, Version } from '@nestjs/common';
import { ConvertAddressToCoordinatesRequest } from '../dto/convert-address-to-coordinates.request';
import { ConvertAddressToCoordinatesResponse } from '../dto/convert-address-to-coordinates.response';
import { ZipCode } from '@/domain/value-object/zip-code.value-object';
import { State } from '@/domain/value-object/state.value-object';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Addresses')
@Controller('convert-address-to-coordinates')
export class ConvertAddressToCoordinatesController {
  constructor(
    private readonly convertAddressToCoordinatesUseCase: ConvertAddressToCoordinatesUseCase,
  ) {}

  @Version('1')
  @Get('/')
  @HttpCode(200)
  @ApiOkResponse({ type: ConvertAddressToCoordinatesResponse })
  async execute(
    @Query() request: ConvertAddressToCoordinatesRequest,
  ): Promise<ConvertAddressToCoordinatesResponse> {
    const { zipCode, state, ...remainingProps } = request;

    const result = await this.convertAddressToCoordinatesUseCase.execute({
      zipCode: new ZipCode(zipCode),
      state: new State(state),
      ...remainingProps,
    });

    return {
      lat: result.value.latitude,
      lng: result.value.longitude,
    };
  }
}
