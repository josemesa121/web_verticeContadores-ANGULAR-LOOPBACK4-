import { Entity, model, property, belongsTo } from '@loopback/repository';
import { User } from '.';

@model({ settings: { strict: false } })
export class DocumentoCategoria extends Entity {

  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id?: number;

  @belongsTo(() => User)
  userId: number;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  getId() {
    return this.id;
  }
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<DocumentoCategoria>) {
    super(data);
  }
}

export interface DocumentoCategoriaRelations {
  // describe navigational properties here
}

export type DocumentoCategoriaWithRelations = DocumentoCategoria & DocumentoCategoriaRelations;
