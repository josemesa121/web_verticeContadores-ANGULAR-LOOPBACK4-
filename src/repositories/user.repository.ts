// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  DefaultCrudRepository,
  juggler,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import { User, Empresa, DocumentoCategoria, Documento } from '../models';
import { inject } from '@loopback/core';
import { DbDataSource } from '../datasources';
import { EmpresaRepository } from './empresa.repository';
import { DocumentoCategoriaRepository } from './documento-categoria.repository';
import { DocumentoRepository } from './documento.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
  > {

  public empresas: HasManyRepositoryFactory<Empresa, typeof User.prototype.id>;
  public documentoCategorias: HasManyRepositoryFactory<DocumentoCategoria, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository(EmpresaRepository) protected empresaRepository: EmpresaRepository,
    @repository(DocumentoCategoriaRepository) protected documentoCategoriaRepository: DocumentoCategoriaRepository,
  ) {
    super(User, dataSource);
    this.empresas = this.createHasManyRepositoryFactoryFor(
      'empresas',
      async () => empresaRepository,
    );
    this.documentoCategorias = this.createHasManyRepositoryFactoryFor(
      'documentoCategorias',
      async () => documentoCategoriaRepository,
    );

  }
}
