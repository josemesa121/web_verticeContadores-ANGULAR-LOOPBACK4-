import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {
  Empresa,
  EmpresaRelations,
  Documento,
  EmpresaObligacion,
  User,
} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DocumentoRepository} from './documento.repository';
import {EmpresaObligacionRepository} from './empresa-obligacion.repository';

export class EmpresaRepository extends DefaultCrudRepository<
  Empresa,
  typeof Empresa.prototype.id,
  EmpresaRelations
> {
  public readonly empresaObligaciones: HasManyRepositoryFactory<
    EmpresaObligacion,
    typeof Empresa.prototype.id
  >;

  public documentos: HasManyRepositoryFactory<
    Documento,
    typeof Empresa.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('DocumentoRepository')
    protected documentoRepositoryGetter: Getter<DocumentoRepository>,
    @repository.getter('EmpresaObligacionRepository')
    protected empresaObligacionRepositoryGetter: Getter<
      EmpresaObligacionRepository
    >,

    @repository(DocumentoRepository)
    protected documentoRepository: DocumentoRepository,
  ) {
    super(Empresa, dataSource);

    this.empresaObligaciones = this.createHasManyRepositoryFactoryFor(
      'empresaObligaciones',
      empresaObligacionRepositoryGetter,
    );

    this.registerInclusionResolver(
      'empresaObligaciones',
      this.empresaObligaciones.inclusionResolver,
    );

    this.documentos = this.createHasManyRepositoryFactoryFor(
      'documentos',
      async () => documentoRepository,
    );
  }

  getObligaciones(id: number) {
    return this.dataSource.execute(
      `
      select o.id, o.nombre,
        (
          select
            count(*)
          from ObligacionFecha obf
          left outer join EmpresaObligacion eo on (eo.obligacionFechaId = obf.id)
          where
            obf.obligacionId = o.id
            and eo.empresaId = ${id}
            and obf.fecha < now()
            and eo.status = 0
        ) as pendiente
      from Obligacion o
      left outer join ObligacionFecha obf on ( obf.obligacionId = o.id)
      left outer join EmpresaObligacion eo on ( eo.obligacionFechaId = obf.id)
      where eo.id is not null and eo.empresaId = ${id}
      GROUP BY o.id, o.nombre
      ORDER BY o.nombre
      `,
    );
  }

  getObligacionesRango(userId: number, start: string, end: string) {
    return this.dataSource.execute(
      `
       select distinct e.id as empresaId, e.nombre as empresaNombre, obf.obligacionId,
      obf.id as obligacionFechaId, o.nombre, obf.fecha, eo.status
      from Obligacion o
      left outer join ObligacionFecha obf on ( obf.obligacionId = o.id)
      left outer join EmpresaObligacion eo on ( eo.obligacionFechaId = obf.id)
      left outer join Empresa e on(eo.empresaId = e.id)
      where e.userId = ${userId} and eo.id is not null and obf.fecha between '${start}' and '${end}'
      order by fecha asc, empresaNombre asc, eo.status desc
      `,
    );
  }

  getEmpresaObligacion(id: number, obligacionId: number) {
    return this.dataSource.execute(`
    select
      eo.id, eo.status, eo.nota, obf.fecha, obf.descripcion
    from EmpresaObligacion eo
    join ObligacionFecha obf on ( eo.obligacionFechaId = obf.id )
    where
      eo.empresaId = ${id}
      and obf.obligacionId = ${obligacionId}
    order by obf.fecha asc
    `);
  }

  delEmpresaObligacion(id: number, obligacionId: number) {
    return this.dataSource.execute(`
    delete eo from
    EmpresaObligacion eo
    join ObligacionFecha obf on ( obf.id = eo.obligacionFechaId)
    where eo.empresaId = ${id} and obf.obligacionId = ${obligacionId}
    `);
  }

  /**
   * Todas las posibles obligaciones que puede aceptar esta empresa
   * @param id Id de la empresa
   */
  getObligacionConfig(id: number) {
    return this.dataSource.execute(`
    select o.id, o.nombre,
        (
          select
           count(*) > 0
          from ObligacionFecha obf
          left outer join EmpresaObligacion eo on (eo.obligacionFechaId = obf.id)
          where
            obf.obligacionId = o.id
            and eo.empresaId = ${id}
        ) as activo
      from Obligacion o
      where
      o.tipo = 3 or  o.tipo = (select e.tipo from Empresa e where id = ${id})
    `);
  }

  /**
   * Todas las posibles obligaciones que puede aceptar esta empresa
   * @param id Id de la empresa filtrado por id_anio
   */
  getObligacionConfigByAnio(id: number, id_anio: number) {
    return this.dataSource.execute(`
    select o.id, o.nombre,
        (
          select
           count(*) > 0
          from ObligacionFecha obf
          left outer join EmpresaObligacion eo on (eo.obligacionFechaId = obf.id)
          where
            obf.obligacionId = o.id
            and eo.empresaId = ${id}
        ) as activo
      from Obligacion o
      INNER JOIN ObligacionAnio a
      ON o.obligacionAnioId = a.id
      WHERE
      o.obligacionAnioId = ${id_anio} AND
      o.tipo = 3 or  o.tipo = (select e.tipo from Empresa e where id = ${id})
      ORDER BY o.nombre
    `);
  }

  /**
   * Todas los anios de obligaciones
   *
   */
  getAllYears() {
    return this.dataSource.execute(`
    SELECT * FROM ObligacionAnio
    `);
  }

  /**
   * Obtiene todas las obligaciones para una empresa y su año
   * @param id
   */
  getObligacionesByAnio(empresaId: number, obligacionAnioId: number) {
    return this.dataSource.execute(
      `
      select o.id, o.nombre,
        (
          select
            count(*)
          from ObligacionFecha obf
          left outer join EmpresaObligacion eo on (eo.obligacionFechaId = obf.id)
          where
            obf.obligacionId = o.id
            and eo.empresaId = ${empresaId}
            and obf.fecha < now()
            and eo.status = 0
        ) as pendiente
      from Obligacion o
      left outer join ObligacionFecha obf on ( obf.obligacionId = o.id)
      left outer join EmpresaObligacion eo on ( eo.obligacionFechaId = obf.id)
      inner join ObligacionAnio oa on (oa.id = o.obligacionAnioId)
      WHERE eo.id is not null
      AND eo.empresaId = ${empresaId}
      AND oa.id = ${obligacionAnioId}
      GROUP BY o.id, o.nombre
      ORDER BY o.nombre
      `,
    );
  }
}
