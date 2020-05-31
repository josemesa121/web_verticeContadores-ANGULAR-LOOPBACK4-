import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/core';

import { UserService } from 'src/app/services/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  dataLoaded = false;
  users: any;
  user: any;

  currentUserInfo: any;

  constructor(private userService: UserService, private credentialsService: CredentialsService) {}

  ngOnInit() {
    this.currentUserInfo = this.credentialsService.credentials.userInfo;
    this.getUsers();
  }

  getUsers() {
    this.dataLoaded = false;
    this.userService
      .usersGet()
      .then(response => {
        this.users = response.data;
        this.dataLoaded = true;
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateUserRol(user: any) {
    this.user = Object.assign({}, user);

    if (user.super_admin === 1) {
      this.user.super_admin = 0;
    } else {
      this.user.super_admin = 1;
    }

    this.userService
      .userUpdate(this.user)
      .then(response => {
        if (user.super_admin === 1) {
          user.super_admin = 0;
        } else {
          user.super_admin = 1;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  confirmDeleteUser(user: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Estas seguro?',
        text: 'Eliminar este usuario',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this.deleteUser(user);
        }
      });
  }

  deleteUser(user: any) {
    this.userService
      .deleteUser(user)
      .then(response => {
        this.getUsers();

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          title: 'Usuario',
          toast: true,
          text: 'eliminado',
          type: 'success'
        });
      })
      .catch(error => {
        console.log(error.response);
      });
  }
}
