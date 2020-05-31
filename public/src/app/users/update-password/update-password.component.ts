import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/services/user.service';
import { CredentialsService } from '@app/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  user: any = {
    id: this.credentialsService.credentials.userInfo.id,
    password: ''
  };
  currentPassword: any = '';

  constructor(private userService: UserService, private credentialsService: CredentialsService) {}

  ngOnInit() {}

  updatePassword(form: any) {
    const requestBody = { user: this.user, currentPassword: this.currentPassword };

    this.userService
      .passwordUpdate(requestBody)
      .then(response => {
        if (response.data === 'Clave erronea') {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            title: 'Clave erronea',
            toast: true,
            text: 'intente de nuevo',
            type: 'error'
          });
        } else {
          form.reset();

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            title: 'Clave',
            toast: true,
            text: 'Actualizada correctamente',
            type: 'success'
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}
