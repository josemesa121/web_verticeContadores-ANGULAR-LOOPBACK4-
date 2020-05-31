import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { DocumentoCategoriaControllerService } from './api/documentoCategoriaController.service';
import { DocumentoControllerService } from './api/documentoController.service';
import { EmpresaControllerService } from './api/empresaController.service';
import { EmpresaObligacionControllerService } from './api/empresaObligacionController.service';
import { ObligacionControllerService } from './api/obligacionController.service';
import { ObligacionFechaControllerService } from './api/obligacionFechaController.service';
import { PingControllerService } from './api/pingController.service';
import { UserControllerService } from './api/userController.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    DocumentoCategoriaControllerService,
    DocumentoControllerService,
    EmpresaControllerService,
    EmpresaObligacionControllerService,
    ObligacionControllerService,
    ObligacionFechaControllerService,
    PingControllerService,
    UserControllerService
  ]
})
export class ApiModule {
  public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: ApiModule, @Optional() http: HttpClient) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error(
        'You need to import the HttpClientModule in your AppModule! \n' +
          'See also https://github.com/angular/angular/issues/20575'
      );
    }
  }
}
