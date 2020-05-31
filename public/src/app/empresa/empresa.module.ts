import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaComponent } from './empresa.component';
import { EmpresaManageComponent } from './manage/manage.component';
import { SharedModule } from '../shared/shared.module';
import { EmpresaViewComponent } from './view/view.component';
import { DocumentoComponent } from './documento/documento.component';
import { EmpresaViewObligacionComponent } from './view-obligacion/view-obligacion.component';
import { EmpresaObligacionConfigComponent } from './view/obligacion-config/obligacion-config.component';
import { UploadComponent } from './documento/upload/upload.component';
import { DragDropDirective } from './drag-drop.directive';
//import { UploadFileComponent } from './upload-file/upload-file.component';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    EmpresaRoutingModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  declarations: [
    EmpresaComponent,
    DocumentoComponent,
    EmpresaManageComponent,
    EmpresaViewComponent,
    DocumentoComponent,
    EmpresaViewObligacionComponent,
    EmpresaObligacionConfigComponent,
    UploadComponent,
    DragDropDirective
  ]
})
export class EmpresaModule {}
