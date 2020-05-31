import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Empresa,
  Documento,
} from '../models';
import { EmpresaRepository } from '../repositories';

export class EmpresaDocumentoController {
  constructor(
    @repository(EmpresaRepository)
    public empresaRepository: EmpresaRepository,
  ) { }

}
