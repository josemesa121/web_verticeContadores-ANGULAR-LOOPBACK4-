import { DefaultCrudRepository } from '@loopback/repository';
import { Documento, DocumentoRelations } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class DocumentoRepository extends DefaultCrudRepository<
  Documento,
  typeof Documento.prototype.id,
  DocumentoRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Documento, dataSource);
  }
}
