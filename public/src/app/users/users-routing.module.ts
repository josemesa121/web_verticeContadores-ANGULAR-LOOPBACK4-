import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { UserListComponent } from './user-list/user-list.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'users',
      component: UserListComponent,
      data: { title: extract('Usuarios') }
    },
    {
      path: 'update-password',
      component: UpdatePasswordComponent,
      data: { title: extract('Actualizar Clave') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule {}
