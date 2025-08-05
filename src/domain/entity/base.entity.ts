import { EntityId } from '../value-object/entity-id.value-object';

export type EntityProperties = { id: EntityId } & Record<string, any>;

export abstract class BaseEntity<TProperties extends EntityProperties> {
  constructor(protected _properties: TProperties) {}

  public get id(): EntityId {
    return this._properties.id;
  }
}
