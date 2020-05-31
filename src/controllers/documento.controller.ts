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
  RestBindings,

  Request,
  Response,
  SchemaRef,
} from '@loopback/rest';
import { Documento } from '../models';
import { DocumentoRepository, EmpresaRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
import { inject } from '@loopback/core';
import * as multer from 'multer';
var fs = require('fs');
export class DocumentoController {
  constructor(
    @repository(DocumentoRepository)
    public documentoRepository: DocumentoRepository,
    @repository(EmpresaRepository) protected empresaRepo: EmpresaRepository
  ) { }

  @post('/documentos/{empresaId}', {
    responses: {
      '200': {
        description: 'Documento model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Documento) } },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documento, { exclude: ['empresaId'] }),
        },
      },
    })
    documento: Omit<Documento, 'empresaid'>,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.path.number('empresaId') empresaId: number
  ): Promise<Documento> {

    return this.empresaRepo.documentos(empresaId).create(documento);
  }

  @get('/documentos/count', {
    responses: {
      '200': {
        description: 'Documento model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(Documento)) where?: Where<Documento>,
  ): Promise<Count> {
    return this.documentoRepository.count(where);
  }

  @get('/documentos/{empresaId}', {
    responses: {
      '200': {
        description: 'Array of Documento model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Documento) },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.path.number('empresaId') empresaId: number,
    @param.query.object('filter', getFilterSchemaFor(Documento)) filter?: Filter<Documento>,
  ): Promise<Documento[]> {
    return this.empresaRepo.documentos(empresaId).find(filter);
  }

  @patch('/documentos', {
    responses: {
      '200': {
        description: 'Documento PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documento, { partial: true }),
        },
      },
    })
    documento: Documento,
    @param.query.object('where', getWhereSchemaFor(Documento)) where?: Where<Documento>,
  ): Promise<Count> {
    return this.documentoRepository.updateAll(documento, where);
  }

  @get('/documentos/{id}', {
    responses: {
      '200': {
        description: 'Documento model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Documento) } },
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.number('id') id: number): Promise<Documento> {
    return this.documentoRepository.findById(id);
  }

  @patch('/documentos/{id}', {
    responses: {
      '204': {
        description: 'Documento PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documento, { partial: true }),
        },
      },
    })
    documento: Documento,
  ): Promise<void> {
    await this.documentoRepository.updateById(id, documento);
  }

  @put('/documentos/{id}', {
    responses: {
      '204': {
        description: 'Documento PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() documento: Documento,
  ): Promise<void> {
    await this.documentoRepository.replaceById(id, documento);
  }

  @del('/documentos/{id}', {
    responses: {
      '204': {
        description: 'Documento DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.documentoRepository.deleteById(id);
  }


  @post('/documentos/upload/{empresaId}', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: '',
      },
    },
  })
  // @authenticate('jwt')
  async uploadDocumento(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,

      content: {

        // 'application/json': {
        //   schema: getModelSchemaRef(Documento, { exclude: ['empresaId'] }),
        // },

        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          //schema: getModelSchemaRef(Documento, { partial: true }),
          schema: { type: 'object' },
          /*schema: {

            "$ref": "#/components/schemas/Documento",
            "definitions": {
              "Documento":
              {
                "title": "Documento",
                "properties": {
                  "id": { "type": "number" },
                  "empresaId": { "type": "number" },
                  "documentoCategoriaId": { "type": "number" },
                  "nota": { "type": "string" },
                  "path": { "type": "string" },
                },
                "additionalProperties": "True"
              }
            }
          }
          */
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.number('empresaId') empresaId: number
  ): Promise<object> {
    const storage = multer.diskStorage({
      destination: './uploads',
      filename: function (req, file, callback) {
        callback(null, Date.now() + "_" + file.originalname);
      }
    });
    const upload = multer({ storage: storage });
    return new Promise<object>((resolve, reject) => {
      upload.any()(request, response, async err => {
        if (err) {
          console.log(JSON.stringify(err));
          reject(err);
        }

        else {

          const body = (request as any).body;
          const documento = body as Documento;

          let file = null;

          if (Array.isArray(request.files)) {
            file = request.files[0];
          } else {
            file = request.file;
          }

          if (file) {
            documento.path = file.path;
            const documentoCreado = await this.empresaRepo.documentos(empresaId).create(documento);
            resolve(
              documentoCreado
            );
          } else {
            reject({

            })
          }

        }
      });
    });
  }

}
