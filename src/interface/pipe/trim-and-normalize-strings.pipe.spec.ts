import { TrimAndNormalizeStringsPipe } from './trim-and-normalize-strings.pipe';

describe('TrimAndNormalizeStringsPipe', () => {
  let sut: TrimAndNormalizeStringsPipe;

  beforeEach(() => {
    sut = new TrimAndNormalizeStringsPipe();
  });

  it('recursively trims and normalizes a complex nested object', () => {
    // Arrange
    const input = {
      name: ' John ',
      empty: '   ',
      literalNull: ' null ',
      nested: {
        city: ' São Paulo ',
        innerEmpty: ' ',
        deeper: {
          note: ' Hello ',
          blank: '',
          nullStr: 'null',
        },
      },
      arr: [' a ', ' ', ' null ', 123, null, undefined, 'b'],
      preservedNumber: 42,
      preservedNull: null,
      preservedUndefined: undefined,
    };

    const expected = {
      name: 'John',
      empty: undefined,
      literalNull: null,
      nested: {
        city: 'São Paulo',
        innerEmpty: undefined,
        deeper: {
          note: 'Hello',
            blank: undefined,
            nullStr: null,
        },
      },
      arr: ['a', undefined, null, 123, null, undefined, 'b'],
      preservedNumber: 42,
      preservedNull: null,
      preservedUndefined: undefined,
    };

    // Act
    const result = sut.transform(input, {} as any);

    // Assert
    expect(result).toEqual(expected);
  });

  it('normalizes an array root (array of objects)', () => {
    // Arrange
    const input = [
      { title: ' Foo ' },
      { title: ' ' },
      { title: 'null' },
      { title: ' Bar' },
    ];
    const expected = [
      { title: 'Foo' },
      { title: undefined },
      { title: null },
      { title: 'Bar' },
    ];

    // Act
    const result = sut.transform(input, {} as any);

    // Assert
    expect(result).toEqual(expected);
  });

  it('trims a primitive string value', () => {
    // Arrange
    const input = ' Test ';

    // Act
    const result = sut.transform(input, {} as any);

    // Assert
    expect(result).toBe('Test');
  });

  it('converts blank primitive string to undefined', () => {
    // Arrange
    const input = '   ';

    // Act
    const result = sut.transform(input, {} as any);

    // Assert
    expect(result).toBeUndefined();
  });

  it('converts " null " primitive string to null', () => {
    // Arrange
    const input = ' null ';

    // Act
    const result = sut.transform(input, {} as any);

    // Assert
    expect(result).toBeNull();
  });

  it('leaves non-string primitives unchanged', () => {
    // Arrange
    const num = 123;
    const bool = true;
    const nil = null;

    // Act
    const rNum = sut.transform(num, {} as any);
    const rBool = sut.transform(bool, {} as any);
    const rNil = sut.transform(nil, {} as any);

    // Assert
    expect(rNum).toBe(123);
    expect(rBool).toBe(true);
    expect(rNil).toBeNull();
  });

  it('handles deep nesting levels', () => {
    // Arrange
    const input = {
      level1: {
        level2: {
          level3: {
            message: ' Deep Value ',
            empty: ' ',
            nullish: 'null',
            deeperArr: [
              { item: ' A ' },
              { item: ' ' },
              { item: 'null' },
              ' B ',
              ' ',
              'null',
            ],
          },
        },
      },
    };

    const expected = {
      level1: {
        level2: {
          level3: {
            message: 'Deep Value',
            empty: undefined,
            nullish: null,
            deeperArr: [
              { item: 'A' },
              { item: undefined },
              { item: null },
              'B',
              undefined,
              null,
            ],
          },
        },
      },
    };

    // Act
    const result = sut.transform(input, {} as any);

    // Assert
    expect(result).toEqual(expected);
  });
});