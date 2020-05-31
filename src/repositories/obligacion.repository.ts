import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {Obligacion, ObligacionRelations, ObligacionFecha} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ObligacionFechaRepository} from './obligacion-fecha.repository';

export class ObligacionRepository extends DefaultCrudRepository<
  Obligacion,
  typeof Obligacion.prototype.nombre,
  ObligacionRelations
> {
  public readonly fechas: HasManyRepositoryFactory<
    ObligacionFecha,
    typeof Obligacion.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ObligacionFechaRepository')
    protected fechaRepositoryGetter: Getter<ObligacionFechaRepository>,
  ) {
    super(Obligacion, dataSource);

    this.fechas = this.createHasManyRepositoryFactoryFor(
      'fechas',
      fechaRepositoryGetter,
    );

    this.registerInclusionResolver('fechas', this.fechas.inclusionResolver);
  }

  /**
   * Obtiene todas las obligaciones para una empresa y su año
   * @param id
   */
  getAllByObligacionAnioId(obligacionAnioId: number) {
    return this.dataSource.execute(
      `
      select *
      from Obligacion o
      WHERE o.obligacionAnioId  = ${obligacionAnioId}
      ORDER BY o.nombre
      `,
    );
  }
}
