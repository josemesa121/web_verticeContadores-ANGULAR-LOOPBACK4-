import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Empresa, EmpresaWithRelations, ObligacionFecha, ObligacionFechaWithRelations } from '../models';

@model({ settings: {} })
export class EmpresaObligacion extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Empresa)
  empresaId?: number;

  @belongsTo(() => ObligacionFecha)
  obligacionFechaId?: number;

  @property({
    type: 'number',
  })
  status?: number;

  @property({
    type: 'string',
  })
  nota?: string;

  constructor(data?: Partial<EmpresaObligacion>) {
    super(data);
  }
}

export interface EmpresaObligacionRelations {
  empresa?: EmpresaWithRelations;
  obligacionFecha?: ObligacionFechaWithRelations;
}

export type EmpresaObligacionWithRelations = EmpresaObligacion &
  EmpresaObligacionRelations;
