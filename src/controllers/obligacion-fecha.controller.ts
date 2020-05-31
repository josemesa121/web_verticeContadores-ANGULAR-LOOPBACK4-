import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { ObligacionFecha } from '../models';
import { ObligacionFechaRepository } from '../repositories';

export class ObligacionFechaController {
  constructor(
    @repository(ObligacionFechaRepository)
    public obligacionFechaRepository: ObligacionFechaRepository,
  ) { }

  @put('/obligacion-fecha/{id}', {
    responses: {
      '204': {
        description: 'ObligacionFecha PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() obligacionFecha: ObligacionFecha,
  ): Promise<void> {
    await this.obligacionFechaRepository.replaceById(id, obligacionFecha);
  }

}
