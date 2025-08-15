import { ResponseWrapperInterceptor } from './response-wrapper.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError, delay } from 'rxjs';
import { lastValueFrom } from 'rxjs';

const makeCallHandler = (value$: any): CallHandler => ({
  handle: () => value$,
});

describe('ResponseWrapperInterceptor', () => {
  let interceptor: ResponseWrapperInterceptor;

  beforeEach(() => {
    interceptor = new ResponseWrapperInterceptor();
  });

  const cases: Array<[string, any]> = [
    ['primitive number', 42],
    ['primitive string', 'hello'],
    ['object', { a: 1 }],
    ['array', [1, 2, 3]],
    ['null', null],
    ['undefined', undefined],
    ['object already with data key', { data: 'existing' }],
  ];

  it.each(cases)(
    'should wrap %s response into data property',
    async (_label, input) => {
      const handler = makeCallHandler(of(input));
      const result = await lastValueFrom(
        interceptor.intercept({} as ExecutionContext, handler),
      );
      expect(result).toEqual({ data: input });
      // For objects/arrays ensure reference equality (except primitives / null / undefined)
      if (input && (typeof input === 'object' || Array.isArray(input))) {
        expect(result.data).toBe(input);
      }
    },
  );

  it('should wrap asynchronously emitted value', async () => {
    const payload = { async: true };
    const handler = makeCallHandler(of(payload).pipe(delay(1)));
    const result = await lastValueFrom(
      interceptor.intercept({} as ExecutionContext, handler),
    );
    expect(result).toEqual({ data: payload });
  });

  it('should propagate errors without wrapping', async () => {
    const error = new Error('boom');
    const handler = makeCallHandler(throwError(() => error));
    await expect(
      lastValueFrom(interceptor.intercept({} as ExecutionContext, handler)),
    ).rejects.toBe(error);
  });
});
