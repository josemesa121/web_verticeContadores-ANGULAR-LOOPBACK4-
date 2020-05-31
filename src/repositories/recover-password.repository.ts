import {DefaultCrudRepository} from '@loopback/repository';
import {RecoverPasswordRelations, RecoverPassword} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RecoverPasswordRepository extends DefaultCrudRepository<
  RecoverPassword,
  typeof RecoverPassword.prototype.id,
  RecoverPasswordRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(RecoverPassword, dataSource);
  }
}
