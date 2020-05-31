import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {
  Empresa,
  Obligacion,
  ObligacionInfo,
  EmpresaObligacion,
} from '../models';
import {
  EmpresaRepository,
  ObligacionRepository,
  ObligacionFechaRepository,
  EmpresaObligacionRepository,
} from '../repositories';
import {validateCredentials} from '../services/validator';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {inject} from '@loopback/core';
import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {
  CredentialsRequestBody,
  UserProfileSchema,
} from './specs/user-controller.specs';
import {Credentials} from '../repositories/user.repository';
import {PasswordHasher} from '../services/hash.password.bcryptjs';

import {
  TokenServiceBindings,
  PasswordHasherBindings,
  UserServiceBindings,
} from '../keys';
import * as _ from 'lodash';
import * as moment from 'moment';
moment.locale('es');

const excel = require('excel4node');
export class EmpresaController {
  constructor(
    @repository(EmpresaRepository)
    public empresaRepository: EmpresaRepository,
    @repository(ObligacionRepository)
    public obligacionRepo: ObligacionRepository,
    @repository(ObligacionFechaRepository)
    public obligacionFechaRepo: ObligacionFechaRepository,
    @repository(EmpresaObligacionRepository)
    public empresaObligacionRepo: EmpresaObligacionRepository,
    @repository(UserRepository) protected userRepo: UserRepository,
  ) {}

  @post('/empresas', {
    responses: {
      '200': {
        description: 'Empresa model instance',
        content: {'application/json': {schema: getModelSchemaRef(Empresa)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empresa, {exclude: ['id']}),
        },
      },
    })
    empresa: Omit<Empresa, 'id'>,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Empresa> {
    currentUserProfile.id = currentUserProfile[securityId];
    return this.userRepo.empresas(currentUserProfile.id).create(empresa);
  }

  @get('/empresas/count', {
    responses: {
      '200': {
        description: 'Empresa model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(Empresa))
    where?: Where<Empresa>,
  ): Promise<Count> {
    return this.empresaRepository.count(where);
  }

  @get('/empresas', {
    responses: {
      '200': {
        description: 'Array of Empresa model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Empresa)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Empresa))
    filter?: Filter<Empresa>,
  ): Promise<Empresa[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    return this.userRepo.empresas(currentUserProfile.id).find(filter);
  }

  @patch('/empresas', {
    responses: {
      '200': {
        description: 'Empresa PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empresa, {partial: true}),
        },
      },
    })
    empresa: Empresa,
    @param.query.object('where', getWhereSchemaFor(Empresa))
    where?: Where<Empresa>,
  ): Promise<Count> {
    return this.empresaRepository.updateAll(empresa, where);
  }

  @get('/empresas/{id}', {
    responses: {
      '200': {
        description: 'Empresa model instance',
        content: {'application/json': {schema: getModelSchemaRef(Empresa)}},
      },
    },
  })
  @authenticate('jwt')
  async findById(@param.path.number('id') id: number): Promise<Empresa> {
    return this.empresaRepository.findById(id);
  }

  @patch('/empresas/{id}', {
    responses: {
      '204': {
        description: 'Empresa PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empresa, {partial: true}),
        },
      },
    })
    empresa: Empresa,
  ): Promise<void> {
    await this.empresaRepository.updateById(id, empresa);
  }

  @put('/empresas/{id}', {
    responses: {
      '204': {
        description: 'Empresa PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() empresa: Empresa,
  ): Promise<void> {
    await this.empresaRepository.replaceById(id, empresa);
  }

  @del('/empresas/{id}', {
    responses: {
      '204': {
        description: 'Empresa DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.empresaRepository.deleteById(id);
  }

  @get('/empresas/obligaciones/{id}', {
    responses: {
      '200': {
        description: 'Array of ObligacionInfo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionInfo)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findObligaciones(
    @param.path.number('id') id: number,
  ): Promise<ObligacionInfo[]> {
    return this.empresaRepository.getObligaciones(id);
  }

  @get('/empresas/obligaciones-rango/{start}/{end}', {
    responses: {
      '200': {
        description: 'Array of ObligacionInfo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionInfo)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findObligacionesRango(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.path.string('start') start: string,
    @param.path.string('end') end: string,
  ): Promise<any[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    const obligaciones = await this.empresaRepository.getObligacionesRango(
      currentUserProfile.id,
      start,
      end,
    );

    const agrupado = this.groupBy(obligaciones, (pet: {fecha: Date}) =>
      pet.fecha.toISOString(),
    );

    return Object.assign({}, agrupado);
  }

  @get('/empresas/obligaciones-config/{id}', {
    responses: {
      '200': {
        description: 'Array of ObligacionInfo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionInfo)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findObligacionesConfig(
    @param.path.number('id') id: number,
  ): Promise<ObligacionInfo[]> {
    return this.empresaRepository.getObligacionConfig(id);
  }

  @get('/empresas/obligaciones-config/{id}/year/{id_anio}', {
    responses: {
      '200': {
        description: 'Array of ObligacionInfo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionInfo)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findObligacionesConfigByAnio(
    @param.path.number('id') id: number,
    @param.path.number('id_anio') id_anio: number,
  ): Promise<ObligacionInfo[]> {
    return this.empresaRepository.getObligacionConfigByAnio(id, id_anio);
  }

  @get('/empresas/obligaciones-anios', {
    responses: {
      '200': {
        description: 'Array of ObligacionInfo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionInfo)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findAllYears(): Promise<ObligacionInfo[]> {
    return this.empresaRepository.getAllYears();
  }

  @get('/empresas/{id}/obligaciones/{oid}', {
    responses: {
      '200': {
        description: 'Array of ObligacionInfo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionInfo)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findEmpresaObligacion(
    @param.path.number('id') id: number,
    @param.path.number('oid') oid: number,
  ): Promise<any[]> {
    return this.empresaRepository.getEmpresaObligacion(id, oid);
  }

  @post('/empresas/{id}/obligaciones/{oid}', {
    responses: {
      '200': {
        description: 'Array of ObligacionInfo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionInfo)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async createEmpresaObligacion(
    @param.path.number('id') id: number,
    @param.path.number('oid') oid: number,
  ): Promise<any[]> {
    const empresa = await this.empresaRepository.findById(id);

    const obligacion = await this.obligacionRepo.findById(oid.toString());

    const obligacionFechas = await this.obligacionFechaRepo.find({
      where: {
        obligacionId: oid,
        terminal: empresa.getNITTerminal(obligacion.digitos || 0),
      },
    });
    obligacionFechas.forEach(async obligacionFecha => {
      await this.empresaObligacionRepo.create({
        empresaId: empresa.getId(),
        obligacionFechaId: obligacionFecha.getId(),
        status: 0,
      });
    });
    return [];
  }

  @del('/empresas/{id}/obligaciones/{oid}', {
    responses: {
      '200': {
        description: 'Array of ObligacionInfo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionInfo)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async deleteEmpresaObligacion(
    @param.path.number('id') id: number,
    @param.path.number('oid') oid: number,
  ): Promise<any[]> {
    return this.empresaRepository.delEmpresaObligacion(id, oid);
  }

  groupBy(list: any, keyGetter: any) {
    const myArr: any[] = [];

    list.forEach((item: any) => {
      const key = keyGetter(item);

      if (!myArr[key]) {
        myArr[key] = [];
      }

      myArr[key].push(item);
    });

    return myArr;
  }

  @get('/empresas/{id}/obligacionesbyanio/{idAnio}', {
    responses: {
      '200': {
        description: 'Array of ObligacionInfo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionInfo)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findObligacionesByAnio(
    @param.path.number('id') id: number,
    @param.path.number('idAnio') idAnio: number,
  ): Promise<ObligacionInfo[]> {
    return this.empresaRepository.getObligacionesByAnio(id, idAnio);
  }

  @post('/empresas/export-obligaciones-rango', {
    responses: {
      '200': {
        description: 'Export Obligaciones Rango success',
      },
    },
  })
  // @authenticate('jwt')
  async exportObligacionesRango(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              fechasArray: {},
              fechas: {},
              currentWeek: {},
            },
          },
        },
      },
    })
    body: any, //:  Promise<void>
  ) {
    let workbook = new excel.Workbook();

    var options = {
      sheetFormat: {
        defaultColWidth: 50,
      },
    };

    // Add Worksheets to the workbook
    let worksheet = workbook.addWorksheet('Sheet 1', options);

    // Create a reusable style
    let style = workbook.createStyle({
      alignment: {
        horizontal: 'left',
        wrapText: false,
      },
      font: {
        color: '#DADCDD',
        size: 11,
      },
      border: {
        left: {
          style: 'thin',
          color: '#DADCDD',
        },
        right: {
          style: 'thin',
          color: '#DADCDD',
        },
        top: {
          style: 'thin',
          color: '#DADCDD',
        },
        bottom: {
          style: 'thin',
          color: '#DADCDD',
        },
        outline: false,
      },
      fill: {
        // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //§18.18.55 ST_PatternType (Pattern Type)
        fgColor: '00ff26', // HTML style hex value. defaults to black.
        // bgColor: '00ff26', // HTML style hex value. defaults to black
      },
      numberFormat: '',
    });

    let cont = 1;
    style.fill.fgColor.rgb = 'FF16365C';
    style.font.color = 'FFFFFFFF';
    style.font.bold = true;
    style.alignment.horizontal = 'center';
    worksheet
      .cell(cont, 1)
      .string('')
      .style(style);
    worksheet
      .cell(cont, 2)
      .string(
        'Semana del ' +
          moment(body.currentWeek.start).format('D MMM') +
          ' al ' +
          moment(body.currentWeek.end).format('D MMM'),
      )
      .style(style);
    worksheet
      .cell(cont, 3)
      .string('')
      .style(style);
    cont++;

    style.fill.fgColor.rgb = 'FFFFFFFF';
    style.font.color = 'FF000000';
    style.alignment.horizontal = 'left';
    style.font.bold = false;
    for (let b = 0; b < body.fechasArray.length; b++) {
      let date = body.fechasArray[b];
      let fechaString = date.split('T');

      cont++;
      style.font.bold = true;
      worksheet
        .cell(cont, 1)
        .string(
          moment(body.fechasArray[b])
            .utc()
            .format('LL') +
            ' ' +
            moment(body.fechasArray[b])
              .utc()
              .fromNow(),
        )
        .style(style);

      style.font.bold = false;
      let obligaciones = body.fechas[body.fechasArray[b]];

      for (let c = 0; c < body.fechas[body.fechasArray[b]].length; c++) {
        cont++;
        worksheet
          .cell(cont, 1)
          .string(obligaciones[c].empresaNombre)
          .style(style);
        worksheet
          .cell(cont, 2)
          .string(obligaciones[c].nombre)
          .style(style);
        worksheet
          .cell(cont, 3)
          .string(
            obligaciones[c].empresaNombre == 1 ? 'Completado' : 'Pendiente',
          )
          .style(style);
      }
    }

    const re = await workbook.writeToBuffer();
    return re;
  }
}
