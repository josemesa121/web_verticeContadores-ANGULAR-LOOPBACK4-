import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

@NgModule({
  declarations: [UserListComponent, UpdatePasswordComponent],
  imports: [CommonModule, UsersRoutingModule, SharedModule]
})
export class UsersModule {}
