import { Entity, model, property, hasMany } from '@loopback/repository';
import { Obligacion } from './obligacion.model';
@model({ settings: {} })
export class ObligacionAnio extends Entity {
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
  anio?: string;

  @hasMany(() => Obligacion)
  obligaciones?: Obligacion[];

  constructor(data?: Partial<ObligacionAnio>) {
    super(data);
  }
}

export interface ObligacionAnioRelations {
  obligaciones?: ObligacionAnioWithRelations[];
}

export type ObligacionAnioWithRelations = ObligacionAnio & ObligacionAnioRelations;
