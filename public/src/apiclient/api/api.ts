export * from './documentoCategoriaController.service';
import { DocumentoCategoriaControllerService } from './documentoCategoriaController.service';
export * from './documentoController.service';
import { DocumentoControllerService } from './documentoController.service';
export * from './empresaController.service';
import { EmpresaControllerService } from './empresaController.service';
export * from './empresaObligacionController.service';
import { EmpresaObligacionControllerService } from './empresaObligacionController.service';
export * from './obligacionController.service';
import { ObligacionControllerService } from './obligacionController.service';
export * from './obligacionFechaController.service';
import { ObligacionFechaControllerService } from './obligacionFechaController.service';
export * from './pingController.service';
import { PingControllerService } from './pingController.service';
export * from './userController.service';
import { UserControllerService } from './userController.service';
export const APIS = [
  DocumentoCategoriaControllerService,
  DocumentoControllerService,
  EmpresaControllerService,
  EmpresaObligacionControllerService,
  ObligacionControllerService,
  ObligacionFechaControllerService,
  PingControllerService,
  UserControllerService
];
