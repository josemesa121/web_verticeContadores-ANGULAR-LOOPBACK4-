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
import {Obligacion} from '../models';
import {User} from '../models';

import {ObligacionRepository, Credentials} from '../repositories';
import {UserRepository} from '../repositories';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';

import {ObligacionFecha} from '../models';
import {ObligacionFechaRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';

export class ObligacionController {
  currentUser: Promise<User>;

  constructor(
    @repository(ObligacionRepository)
    public obligacionRepository: ObligacionRepository,
    @repository(ObligacionFechaRepository)
    public obligacionFechaRepository: ObligacionFechaRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/obligacion', {
    responses: {
      '200': {
        description: 'Obligacion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Obligacion)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Obligacion, {exclude: ['id']}),
        },
      },
    })
    obligacion: Omit<Obligacion, 'id'>,
  ): Promise<any> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];

    this.currentUser = this.userRepository.findById(currentUserProfile.id, {
      fields: {password: false},
    });

    if ((await this.currentUser).super_admin == 1) {
      const obligacionCreated = await this.obligacionRepository.create(
        obligacion,
      );
      if (obligacionCreated) {
        const rangoDigitos = obligacion!.digitos || 0;
        const rangoPeriodicidad = obligacion!.periodicidad || 0;
        let contador = 1;
        for (let i = 0; i < rangoDigitos; i++) {
          for (let j = 0; j < rangoPeriodicidad; j++) {
            const terminal =
              rangoDigitos > 10
                ? i < 10
                  ? '0' + i.toString()
                  : i.toString()
                : i.toString();
            const ofecha = {
              numero: contador.toString(),
              obligacionId: obligacionCreated.id,
              terminal: terminal,
              fecha: new Date(
                new Date().getFullYear(),
                (12 / rangoPeriodicidad) * j,
                1,
                0,
                0,
                0,
              ).toDateString(),
            };
            contador++;
            await this.obligacionFechaRepository.create(ofecha);
          }
        }
      }
      return obligacionCreated;
    } else {
      return [{error: 'Unauthorized'}];
    }
  }

  @get('/obligacion/count', {
    responses: {
      '200': {
        description: 'Obligacion model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.query.object('where', getWhereSchemaFor(Obligacion))
    where?: Where<Obligacion>,
  ): Promise<any> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];

    this.currentUser = this.userRepository.findById(currentUserProfile.id, {
      fields: {password: false},
    });

    if ((await this.currentUser).super_admin == 1) {
      return this.obligacionRepository.count(where);
    } else {
      return [{error: 'Unauthorized'}];
    }
  }

  @get('/obligacion', {
    responses: {
      '200': {
        description: 'Array of Obligacion model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Obligacion)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.query.object('filter', getFilterSchemaFor(Obligacion))
    filter?: Filter<Obligacion>,
  ): Promise<any[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];

    this.currentUser = this.userRepository.findById(currentUserProfile.id, {
      fields: {password: false},
    });

    if ((await this.currentUser).super_admin == 1) {
      return this.obligacionRepository.find(filter);
    } else {
      return [{error: 'Unauthorized'}];
    }
  }

  @patch('/obligacion', {
    responses: {
      '200': {
        description: 'Obligacion PATCH succs count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Obligacion, {partial: true}),
        },
      },
    })
    obligacion: Obligacion,
    @param.query.object('where', getWhereSchemaFor(Obligacion))
    where?: Where<Obligacion>,
  ): Promise<any> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];

    this.currentUser = this.userRepository.findById(currentUserProfile.id, {
      fields: {password: false},
    });

    if ((await this.currentUser).super_admin == 1) {
      return this.obligacionRepository.updateAll(obligacion, where);
    } else {
      return [{error: 'Unauthorized'}];
    }
  }

  @get('/obligacion/{id}', {
    responses: {
      '200': {
        description: 'Obligacion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Obligacion)}},
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.path.number('id') id: number,
  ): Promise<any> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];

    this.currentUser = this.userRepository.findById(currentUserProfile.id, {
      fields: {password: false},
    });

    if ((await this.currentUser).super_admin == 1) {
      return this.obligacionRepository.findById(id.toString());
    } else {
      return [{error: 'Unauthorized'}];
    }
  }

  @patch('/obligacion/{id}', {
    responses: {
      '204': {
        description: 'Obligacion PATCH succs',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Obligacion, {partial: true}),
        },
      },
    })
    obligacion: Obligacion,
  ): Promise<any[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];

    this.currentUser = this.userRepository.findById(currentUserProfile.id, {
      fields: {password: false},
    });

    if ((await this.currentUser).super_admin == 1) {
      await this.obligacionRepository.updateById(id.toString(), obligacion);
      return [{status: 200}];
    } else {
      return [{error: 'Unauthorized'}];
    }
  }

  @put('/obligacion/{id}', {
    responses: {
      '204': {
        description: 'Obligacion PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.path.number('id') id: number,
    @requestBody() obligacion: Obligacion,
  ): Promise<any[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];

    this.currentUser = this.userRepository.findById(currentUserProfile.id, {
      fields: {password: false},
    });

    if ((await this.currentUser).super_admin == 1) {
      await this.obligacionRepository.replaceById(id.toString(), obligacion);
      return [{status: 200}];
    } else {
      return [{error: 'Unauthorized'}];
    }
  }

  @del('/obligacion/{id}', {
    responses: {
      '204': {
        description: 'Obligacion DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.path.number('id') id: number,
  ): Promise<any[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];

    this.currentUser = this.userRepository.findById(currentUserProfile.id, {
      fields: {password: false},
    });

    if ((await this.currentUser).super_admin == 1) {
      await this.obligacionRepository.deleteById(id.toString());
      return [{status: 200}];
    } else {
      return [{error: 'Unauthorized'}];
    }
  }

  @get('/obligacion/fechas/{id}', {
    responses: {
      '200': {
        description: 'Array of Fecha Obligacion model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionFecha)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findFechas(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(ObligacionFecha))
    filter?: Filter<ObligacionFecha>,
  ): Promise<any[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];

    this.currentUser = this.userRepository.findById(currentUserProfile.id, {
      fields: {password: false},
    });

    if ((await this.currentUser).super_admin == 1) {
      return this.obligacionRepository.fechas(id).find(filter);
    } else {
      return [{error: 'Unauthorized'}];
    }
  }

  @get('/obligacion-by-anio/{id}', {
    responses: {
      '200': {
        description: 'Array of Fecha Obligacion model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObligacionFecha)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findByAnioId(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(ObligacionFecha))
    filter?: Filter<ObligacionFecha>,
  ): Promise<any[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];

    this.currentUser = this.userRepository.findById(currentUserProfile.id, {
      fields: {password: false},
    });

    if ((await this.currentUser).super_admin == 1) {
      // filter = {
      //   order: ['nombre ASC'],
      // }
      return this.obligacionRepository.getAllByObligacionAnioId(id);
    } else {
      return [{error: 'Unauthorized'}];
    }
  }
}
