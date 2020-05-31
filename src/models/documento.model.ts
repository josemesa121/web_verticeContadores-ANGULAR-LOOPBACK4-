import { Entity, model, property, belongsTo } from '@loopback/repository';
import { User, Empresa } from '.';
import { DocumentoCategoria } from './documento-categoria.model';

@model({ settings: {} })
export class Documento extends Entity {

  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id?: number;

  @belongsTo(() => Empresa)
  empresaId: number;

  @belongsTo(() => DocumentoCategoria)
  documentoCategoriaId?: number;

  @property({
    type: 'string',
  })
  nota?: string;

  @property({
    type: 'string',
  })
  path?: string;

  constructor(data?: Partial<Documento>) {
    super(data);
  }
}

export interface DocumentoRelations {
  // describe navigational properties here
}

export type DocumentoWithRelations = Documento & DocumentoRelations;
