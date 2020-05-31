import { Entity, model, property, hasMany, belongsTo } from '@loopback/repository';
import { ObligacionFecha, ObligacionFechaRelations, ObligacionFechaWithRelations } from './obligacion-fecha.model';
import { ObligacionAnio, ObligacionAnioWithRelations } from './obligacion-anio.model';
@model({ settings: {} })
export class Obligacion extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  nombre?: string;

  @property({
    type: 'number',
    required: true
  })
  digitos?: number;

  @property({
    type: 'number',
    required: true
  })
  periodicidad?: number;

  @property({
    type: 'number',
    required: true
  })
  tipo?: number;

  @belongsTo(() => ObligacionAnio)
  obligacionAnioId?: number;

  @hasMany(() => ObligacionFecha)
  fechas?: ObligacionFecha[];

  constructor(data?: Partial<Obligacion>) {
    super(data);
  }
}

export interface ObligacionRelations {
  obligacionAnio: ObligacionAnioWithRelations;
  fechas?: ObligacionFechaWithRelations[];
}

export type ObligacionWithRelations = Obligacion & ObligacionRelations;
