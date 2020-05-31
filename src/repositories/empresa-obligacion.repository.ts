import { DefaultCrudRepository, BelongsToAccessor, repository } from '@loopback/repository';
import { EmpresaObligacion, EmpresaObligacionRelations, Empresa } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { EmpresaRepository } from '.';

export class EmpresaObligacionRepository extends DefaultCrudRepository<
  EmpresaObligacion,
  typeof EmpresaObligacion.prototype.id,
  EmpresaObligacionRelations
  > {

  public readonly empresa: BelongsToAccessor<
    Empresa,
    typeof EmpresaObligacion.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('EmpresaRepository')
    protected empresaRepositoryGetter: Getter<EmpresaRepository>,
  ) {
    super(EmpresaObligacion, dataSource);

    this.empresa = this.createBelongsToAccessorFor(
      'empresa',
      empresaRepositoryGetter,
    );
    this.registerInclusionResolver('empresa', this.empresa.inclusionResolver);


  }
}
