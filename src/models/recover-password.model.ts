import {Entity, model, property} from '@loopback/repository';

@model()
export class RecoverPassword extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  codigo: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha_expiracion: Date;

  @property({
    type: 'number',
    required: true,
  })
  userId: number;

  constructor(data?: Partial<RecoverPassword>) {
    super(data);
  }
}

export interface RecoverPasswordRelations {
  // describe navigational properties here
}

export type RecoverPasswordWithRelations = RecoverPassword &
  RecoverPasswordRelations;
