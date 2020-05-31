// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {repository, Filter} from '@loopback/repository';
import {validateCredentials} from '../services/validator';
import {
  post,
  param,
  get,
  put,
  del,
  patch,
  getModelSchemaRef,
  requestBody,
  HttpErrors,
  getFilterSchemaFor,
} from '@loopback/rest';
import {User, Empresa, RecoverPassword} from '../models';
import {UserRepository, RecoverPasswordRepository} from '../repositories';
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

const uuid = require('uuid');
const nodemailer = require('nodemailer');

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @repository(RecoverPasswordRepository)
    public recoverPasswordRepository: RecoverPasswordRepository,
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async create(@requestBody() user: User): Promise<User> {
    // ensure a valid email value and password value
    validateCredentials(_.pick(user, ['email', 'password']));

    // encrypt the password
    // eslint-disable-next-line require-atomic-updates
    user.password = await this.passwordHasher.hashPassword(user.password);

    try {
      // create the new user
      const savedUser = await this.userRepository.create(user);
      delete savedUser.password;

      let mailData = {
        from: '"Vertice Accounts" <app@verticeaccounts.com>', // sender address
        to: user.email, // list of receivers
        subject: 'Bienvenid@ a Vertice Accounts - Agenda Tributaria', // Subject line
        text:
          'Hola ' +
          user.firstName +
          ', gracias por registrarte, ya puedes iniciar sesión en http://app.verticeaccounts.com', // plain text body
        html:
          'Hola <b>' +
          user.firstName +
          "</b>, gracias por registrarte en Vertice Accounts. Ahora puedes iniciar sesión en nuestra <a href='http://app.verticeaccounts.com/'>Agenda Tributaria</a>", // html body
      };
      this.sendMail(mailData);

      return savedUser;
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }

  async sendMail(mailData: any) {
    // let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.co',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'app@verticeaccounts.com', // generated ethereal user
        pass: 'k8yL5RCc', // generated ethereal password
      },
    });
    await transporter.sendMail(mailData);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<User[]> {
    if (!filter) {
      filter = {};
    }
    filter.fields = {
      password: false,
    };
    return this.userRepository.find(filter);
  }

  @get('/users/{userId}', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async findById(@param.path.string('userId') userId: number): Promise<User> {
    return this.userRepository.findById(userId, {
      fields: {password: false},
    });
  }

  @get('/users/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    // (@jannyHou)FIXME: explore a way to generate OpenAPI schema
    // for symbol property
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];
    return currentUserProfile;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string; user: any}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token, user};
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'Usuarios PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    if (user.password) {
      user.password = await this.passwordHasher.hashPassword(user.password);
    }
    await this.userRepository.updateById(id, user);
  }

  @patch('/users/update-password/{id}', {
    responses: {
      '204': {
        description: 'Usuarios PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updatePasswordById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              user: getModelSchemaRef(User, {partial: true}),
              currentPassword: {type: 'string'},
            },
          },
        },
      },
    })
    body: any, //:  Promise<void>
  ) {
    const userFound = await this.userRepository.findById(id);
    const confirmPassword = await this.passwordHasher.comparePassword(
      body.currentPassword,
      userFound.password,
    );

    if (!confirmPassword) {
      return 'Clave erronea';
    }

    body.user.password = await this.passwordHasher.hashPassword(
      body.user.password,
    );
    await this.userRepository.updateById(id, body.user);
  }

  @post('/recover-password', {
    responses: {
      '204': {
        description: 'Recover password POST success',
      },
    },
  })
  async recover_password(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              email: {type: 'string'},
            },
          },
        },
      },
    })
    body: any, //:  Promise<void>
  ) {
    const userFound = await this.userRepository.findOne({
      where: {email: body.email},
      fields: {password: false},
    });

    if (!userFound) {
      return {status: 'error', message: 'Correo no encontrado.'};
    }

    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 2);

    let recover_password_data = {
      codigo: uuid.v4(),
      fecha_expiracion: currentDate,
      userId: userFound.id,
    };
    this.recoverPasswordRepository.create(recover_password_data);

    let mailData = {
      from: '"Vertice Accounts" <app@verticeaccounts.com>', // sender address
      to: userFound.email, // list of receivers
      subject: 'Retaurar clave', // Subject line
      text: 'Restaurar clave', // plain text body
      html:
        'Hola <b>' +
        userFound.firstName +
        "</b>, para terminar con el proceso de restauración de tu clave haz click en el siguiente enlace: <a href='http://localhost:4500/reset-password/" +
        recover_password_data.codigo +
        "'>Click aquí.</a>", // html body
    };
    this.sendMail(mailData);

    return {status: 'ok', message: 'Correo enviado.'};
  }

  // @get('/verify-recover-password/{code}', {
  //   responses: {
  //     '200': {
  //       description: 'Verify recover password',
  //     },
  //   },
  // })
  // async verify_recover_password(
  //   @param.path.string('code') code: string
  // ) {

  //   const verify = await this.recoverPasswordRepository.findOne({ where: { codigo: code } });

  //   if (!verify) {
  //     return { status: 'error', message: 'Código de verificación no encontrado.' }
  //   }

  //   let now = new Date;
  //   if (now > verify.fecha_expiracion) {
  //     return { status: 'error', message: 'Código de verificación expirado. Puede repetir el procedimiento ingresando su correo otra vez.' }
  //   }

  //   return { status: 'ok', message: 'Verificación exitosa.', data: verify }
  // }

  @patch('/reset-password', {
    responses: {
      '204': {
        description: 'Reset password PATCH success',
      },
    },
  })
  async reset_password(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              password: {type: 'string'},
              codigo: {type: 'string'},
            },
          },
        },
      },
    })
    body: any, //:  Promise<void>
  ) {
    const verify = await this.recoverPasswordRepository.findOne({
      where: {codigo: body.codigo},
    });

    if (!verify) {
      return {
        status: 'error',
        message: 'Código de verificación no encontrado.',
      };
    }

    let now = new Date();
    if (now > verify.fecha_expiracion) {
      return {
        status: 'error',
        message:
          'Código de verificación expirado. Puede solicitar un correo de restauración otra vez.',
      };
    }

    body.password = await this.passwordHasher.hashPassword(body.password);

    this.userRepository.updateById(verify.userId, {password: body.password});

    this.recoverPasswordRepository.deleteAll({userId: verify.userId});

    return {status: 'ok', message: 'Clave restablecida exitosamente.'};
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
