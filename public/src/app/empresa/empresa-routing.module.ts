import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { EmpresaComponent } from './empresa.component';
import { EmpresaManageComponent } from './manage/manage.component';
import { EmpresaViewComponent } from './view/view.component';

import { DocumentoComponent } from '../empresa/documento/documento.component';
import { EmpresaViewObligacionComponent } from './view-obligacion/view-obligacion.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'empresa',
      component: EmpresaComponent,
      data: { title: extract('Empresa') }
    },
    {
      path: 'empresa/crear',
      component: EmpresaManageComponent,
      data: {
        title: extract('Empresa Nueva')
      }
    },
    {
      path: 'empresa/editar/:id',
      component: EmpresaManageComponent,
      data: {
        title: extract('Empresa Nueva')
      }
    },
    {
      path: 'empresa/:id/obligacion/:oid',
      component: EmpresaViewObligacionComponent,
      data: {
        title: extract('Empresa')
      }
    },
    {
      path: 'empresa/:id',
      component: EmpresaViewComponent,
      data: {
        title: extract('Empresa')
      }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EmpresaRoutingModule {}
