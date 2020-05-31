import { Model, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class ObligacionInfo extends Model {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  nombre?: string;

  @property({
    type: 'number',
  })
  pendiente?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ObligacionInfo>) {
    super(data);
  }
}

export interface ObligacionInfoRelations {
  // describe navigational properties here
}

export type ObligacionInfoWithRelations = ObligacionInfo & ObligacionInfoRelations;
