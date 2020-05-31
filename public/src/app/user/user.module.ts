import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '@app/shared';
import { UserRoutingModule } from './user-routing.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [RegisterComponent, ResetPasswordComponent],
  imports: [CommonModule, SharedModule, UserRoutingModule]
})
export class UserModule {}
