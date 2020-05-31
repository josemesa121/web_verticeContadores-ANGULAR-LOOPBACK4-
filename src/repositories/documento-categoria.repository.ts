import {DefaultCrudRepository} from '@loopback/repository';
import {DocumentoCategoria, DocumentoCategoriaRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DocumentoCategoriaRepository extends DefaultCrudRepository<
  DocumentoCategoria,
  typeof DocumentoCategoria.prototype.userId,
  DocumentoCategoriaRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DocumentoCategoria, dataSource);
  }
}
