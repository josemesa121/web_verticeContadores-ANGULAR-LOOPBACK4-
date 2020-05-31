import { Entity, model, property, belongsTo, hasMany, hasOne } from '@loopback/repository';
import { Documento } from './documento.model';
import { EmpresaObligacion, EmpresaObligacionWithRelations, User } from '.';

@model({ settings: {} })
export class Empresa extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'number',
    required: true
  })
  tipo?: number;

  @property({
    type: 'string',
  })
  nit?: string;

  @property({
    type: 'string',
  })
  nitDigito?: string;

  @property({
    type: 'string',
    default: null,
    nullable: true,
    required: false,
    jsonSchema: { nullable: true }
  })
  contacto?: string;

  @property({
    type: 'string',
    default: null,
    nullable: true,
    required: false,
    jsonSchema: { nullable: true }
  })
  direccion?: string;

  @property({
    type: 'string',
    default: null,
    nullable: true,
    required: false,
    jsonSchema: { nullable: true }
  })
  email?: string;

  @property({
    type: 'string',
    default: null,
    nullable: true,
    required: false,
    jsonSchema: { nullable: true }
  })
  telefono?: string;

  @property({
    type: 'string',
    default: null,
    nullable: true,
    required: false,
    jsonSchema: { nullable: true }
  })
  cedula?: string;

  @property({
    type: 'string',
    default: null,
    nullable: true,
    required: false,
    jsonSchema: { nullable: true }
  })
  clave_dian?: string;

  @property({
    type: 'string',
    default: null,
    nullable: true,
    required: false,
    jsonSchema: { nullable: true }
  })
  clave_firma_dian?: string;

  @property({
    type: 'string',
    default: null,
    nullable: true,
    required: false,
    jsonSchema: { nullable: true }
  })
  place_iyc?: string;

  @property({
    type: 'string',
    default: null,
    nullable: true,
    required: false,
    jsonSchema: { nullable: true }
  })
  placa_reteica?: string;

  @property({
    type: 'string',
    default: null,
    nullable: true,
    required: false,
    jsonSchema: { nullable: true }
  })
  datos_contabilidad?: string;

  @belongsTo(() => User)
  userId: number;

  @hasMany(() => EmpresaObligacion)
  empresaObligaciones?: EmpresaObligacion[];

  @hasMany(() => Documento)
  documentos?: Documento[];

  getId() {
    return this.id;
  }

  getNITTerminal(digitos: number) {

    if (this.nit) {
      return this.nit.substr(this.nit.length - (digitos == 10 ? 1 : 2));
    }

    return '';

  }

  constructor(data?: Partial<Empresa>) {
    super(data);
  }
}

export interface EmpresaRelations {
  empresaObligaciones?: EmpresaObligacionWithRelations[];
}

export type EmpresaWithRelations = Empresa & EmpresaRelations;
