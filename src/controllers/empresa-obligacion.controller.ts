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
import { EmpresaObligacion } from '../models';
import { EmpresaObligacionRepository } from '../repositories';

export class EmpresaObligacionController {
  constructor(
    @repository(EmpresaObligacionRepository)
    public empresaObligacionRepository: EmpresaObligacionRepository,
  ) { }

  @get('/empresa-obligacion/{id}', {
    responses: {
      '200': {
        description: 'EmpresaObligacion model instance',
        content: { 'application/json': { schema: getModelSchemaRef(EmpresaObligacion) } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<EmpresaObligacion> {
    return this.empresaObligacionRepository.findById(id);
  }

  @patch('/empresa-obligacion/{id}', {
    responses: {
      '204': {
        description: 'EmpresaObligacion PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EmpresaObligacion, { partial: true }),
        },
      },
    })
    empresaObligacion: EmpresaObligacion,
  ): Promise<void> {
    await this.empresaObligacionRepository.updateById(id, empresaObligacion);
  }

  @put('/empresa-obligacion/{id}', {
    responses: {
      '204': {
        description: 'EmpresaObligacion PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() empresaObligacion: EmpresaObligacion,
  ): Promise<void> {
    await this.empresaObligacionRepository.replaceById(id, empresaObligacion);
  }

}
