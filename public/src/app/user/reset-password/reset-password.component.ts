import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  user: any = {
    password: ''
  };

  errorMessage: any = '';

  confirmPassword: any = '';

  params: any;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.params = this.route.snapshot.params;
  }

  resetPassword(form: any) {
    const requestBody = { password: this.user.password, codigo: this.params.code };
    this.errorMessage = '';

    this.userService
      .resetPassword(requestBody)
      .then(response => {
        if (response.data.status === 'ok') {
          form.reset();

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 8000
          });
          Toast.fire({
            title: 'Clave Actualizada',
            toast: true,
            text: 'Ahora puedes iniciar sesión con tu nueva clave.',
            type: 'success'
          });
        } else {
          this.errorMessage = response.data.message;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}
