import { ConvertAddressToCoordinatesUseCase } from '@/application/use-case/convert-address-to-coordinates.use-case';
import { Controller, Get, HttpCode, Query, Version } from '@nestjs/common';
import { ConvertAddressToCoordinatesRequest } from '../dto/convert-address-to-coordinates.request';
import { ConvertAddressToCoordinatesResponse } from '../dto/convert-address-to-coordinates.response';
import { ZipCode } from '@/domain/value-object/zip-code.value-object';
import { State } from '@/domain/value-object/state.value-object';
import { ApiTags } from '@nestjs/swagger';
import { WrappedApiOkResponse } from '../decorator/wrapper-api-ok-response.decorator';
import { DefaultApiErrorResponse } from '../decorator/default-api-error-response.decorator';
import { DefaultApiValidationErrorResponse } from '../decorator/default-api-validation-error-response.decorator';

@ApiTags('Addresses')
@Controller('convert-address-to-coordinates')
export class ConvertAddressToCoordinatesController {
  constructor(
    private readonly convertAddressToCoordinatesUseCase: ConvertAddressToCoordinatesUseCase,
  ) {}

  @Version('1')
  @Get('/')
  @HttpCode(200)
  @WrappedApiOkResponse(ConvertAddressToCoordinatesResponse)
  @DefaultApiErrorResponse()
  @DefaultApiValidationErrorResponse()
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
