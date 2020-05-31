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
import { DocumentoCategoria } from '../models';
import { DocumentoCategoriaRepository, UserRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
import { inject } from '@loopback/core';

export class DocumentoCategoriaController {
  constructor(
    @repository(DocumentoCategoriaRepository)
    public documentoCategoriaRepository: DocumentoCategoriaRepository,
    @repository(UserRepository) protected userRepo: UserRepository
  ) { }

  @post('/documento-categorias', {
    responses: {
      '200': {
        description: 'DocumentoCategoria model instance',
        content: { 'application/json': { schema: getModelSchemaRef(DocumentoCategoria) } },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentoCategoria, { exclude: ['id'] }),
        },
      },
    })
    documentoCategoria: Omit<DocumentoCategoria, 'id'>,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile
  ): Promise<DocumentoCategoria> {
    currentUserProfile.id = currentUserProfile[securityId];
    return this.userRepo.documentoCategorias(currentUserProfile.id).create(documentoCategoria);
  }

  @get('/documento-categorias/count', {
    responses: {
      '200': {
        description: 'DocumentoCategoria model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(DocumentoCategoria)) where?: Where<DocumentoCategoria>,
  ): Promise<Count> {
    return this.documentoCategoriaRepository.count(where);
  }

  @get('/documento-categorias', {
    responses: {
      '200': {
        description: 'Array of DocumentoCategoria model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(DocumentoCategoria) },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(DocumentoCategoria)) filter?: Filter<DocumentoCategoria>,
  ): Promise<DocumentoCategoria[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    return this.userRepo.documentoCategorias(currentUserProfile.id).find(filter);;
  }

  @patch('/documento-categorias', {
    responses: {
      '200': {
        description: 'DocumentoCategoria PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentoCategoria, { partial: true }),
        },
      },
    })
    documentoCategoria: DocumentoCategoria,
    @param.query.object('where', getWhereSchemaFor(DocumentoCategoria)) where?: Where<DocumentoCategoria>,
  ): Promise<Count> {
    return this.documentoCategoriaRepository.updateAll(documentoCategoria, where);
  }

  @get('/documento-categorias/{id}', {
    responses: {
      '200': {
        description: 'DocumentoCategoria model instance',
        content: { 'application/json': { schema: getModelSchemaRef(DocumentoCategoria) } },
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.number('id') id: number): Promise<DocumentoCategoria> {
    return this.documentoCategoriaRepository.findById(id);
  }

  @patch('/documento-categorias/{id}', {
    responses: {
      '204': {
        description: 'DocumentoCategoria PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentoCategoria, { partial: true }),
        },
      },
    })
    documentoCategoria: DocumentoCategoria,
  ): Promise<void> {
    await this.documentoCategoriaRepository.updateById(id, documentoCategoria);
  }

  @put('/documento-categorias/{id}', {
    responses: {
      '204': {
        description: 'DocumentoCategoria PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() documentoCategoria: DocumentoCategoria,
  ): Promise<void> {
    await this.documentoCategoriaRepository.replaceById(id, documentoCategoria);
  }

  @del('/documento-categorias/{id}', {
    responses: {
      '204': {
        description: 'DocumentoCategoria DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.documentoCategoriaRepository.deleteById(id);
  }
}
