import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class TrimAndNormalizeStringsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) {
      return this.trimString(value);
    }

    return this.trimRecursively(value);
  }

  private trimString(
    property: string | null | undefined,
  ): string | null | undefined {
    if (typeof property !== 'string') {
      return property;
    }

    const trimmed = property.trim();

    if (!trimmed) {
      return undefined;
    }

    if ('null' === trimmed) {
      return null;
    }

    return trimmed;
  }

  private trimRecursively(property: any): any | null | undefined {
    if (Array.isArray(property)) {
      return property.map((item) => this.trimRecursively(item));
    }

    if (property && typeof property === 'object') {
      const result: any = {};

      Object.keys(property).forEach((key) => {
        result[key] = this.trimRecursively(property[key]);
      });

      return result;
    }

    return this.trimString(property);
  }
}
