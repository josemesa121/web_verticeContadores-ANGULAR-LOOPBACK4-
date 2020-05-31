import { DefaultCrudRepository, BelongsToAccessor, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { ObligacionFecha, ObligacionFechaRelations, Obligacion, EmpresaObligacion } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { ObligacionRepository } from './obligacion.repository';
import { EmpresaObligacionRepository } from './empresa-obligacion.repository';

export class ObligacionFechaRepository extends DefaultCrudRepository<
  ObligacionFecha,
  typeof ObligacionFecha.prototype.id,
  ObligacionFechaRelations
  > {

  public readonly obligacion: BelongsToAccessor<
    Obligacion,
    typeof ObligacionFecha.prototype.id
  >;

  public readonly empresaObligaciones: HasManyRepositoryFactory<
    EmpresaObligacion,
    typeof ObligacionFecha.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ObligacionRepository')
    protected obligacionRepositoryGetter: Getter<ObligacionRepository>,
    @repository.getter('EmpresaObligacionRepository')
    protected empresaObligacionRepositoryGetter: Getter<EmpresaObligacionRepository>,
  ) {
    super(ObligacionFecha, dataSource);

    this.obligacion = this.createBelongsToAccessorFor(
      'obligacion',
      obligacionRepositoryGetter,
    );
    this.registerInclusionResolver('obligacion', this.obligacion.inclusionResolver);

    this.empresaObligaciones = this.createHasManyRepositoryFactoryFor(
      'empresaObligaciones',
      empresaObligacionRepositoryGetter,
    );

    this.registerInclusionResolver('empresaObligaciones', this.empresaObligaciones.inclusionResolver);
  }
}
