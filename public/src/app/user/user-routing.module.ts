import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: extract('Registro') }
  },
  {
    path: 'reset-password/:code',
    component: ResetPasswordComponent,
    data: { title: extract('Restaurar clave') }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UserRoutingModule {}
