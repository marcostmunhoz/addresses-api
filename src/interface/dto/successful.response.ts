import { Expose } from 'class-transformer';

export class SuccessfulResponse<T> {
  @Expose()
  data: T;
}
