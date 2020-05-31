import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {Obligacion, ObligacionWithRelations} from './obligacion.model';
import {
  EmpresaObligacion,
  EmpresaObligacionWithRelations,
} from './empresa-obligacion.model';

@model({settings: {}})
export class ObligacionFecha extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Obligacion)
  obligacionId?: number;

  @property({
    type: 'string',
  })
  numero?: string;

  @property({
    type: 'string',
  })
  terminal?: string;

  @property({
    type: 'date',
    mysql: {
      dataType: 'DATE',
    },
  })
  fecha?: string;

  @property({
    type: 'string',
  })
  descripcion?: string;

  @hasMany(() => EmpresaObligacion)
  empresaObligaciones?: EmpresaObligacion[];

  getId() {
    return this.id;
  }

  constructor(data?: Partial<ObligacionFecha>) {
    super(data);
  }
}

export interface ObligacionFechaRelations {
  obligacion?: ObligacionWithRelations;
  empresaObligaciones?: EmpresaObligacionWithRelations[];
}

export type ObligacionFechaWithRelations = ObligacionFecha &
  ObligacionFechaRelations;
