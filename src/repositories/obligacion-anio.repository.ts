import { DefaultCrudRepository } from '@loopback/repository';
import { ObligacionAnio, ObligacionAnioRelations } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class ObligacionAnioRepository extends DefaultCrudRepository<
  ObligacionAnio,
  typeof ObligacionAnio.prototype.anio,
  ObligacionAnioRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ObligacionAnio, dataSource);
  }
}
