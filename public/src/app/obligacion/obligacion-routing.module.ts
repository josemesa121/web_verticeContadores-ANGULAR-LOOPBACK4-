import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ObligacionComponent } from './obligacion.component';
import { ObligacionManageComponent } from './manage/manage.component';
import { ObligacionViewComponent } from './view/view.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'obligacion',
      component: ObligacionComponent,
      data: { title: extract('Obligacion') }
    },
    {
      path: 'obligacion/crear',
      component: ObligacionManageComponent,
      data: {
        title: extract('Obligacion Nueva')
      }
    },
    {
      path: 'obligacion/:id',
      component: ObligacionViewComponent,
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
export class ObligacionRoutingModule {}
