import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { UserControllerService, User } from 'src/apiclient';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        label: 'Email',
        required: true
      }
    },
    {
      key: 'firstName',
      type: 'input',
      templateOptions: {
        label: 'Nombre'
      }
    },
    {
      key: 'lastName',
      type: 'input',
      templateOptions: {
        label: 'Apellidos'
      }
    },
    /*
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        label: 'Password',
        required: true
      }
    },
*/
    {
      key: 'password',
      validators: {
        fieldMatch: {
          expression: (control: any) => {
            const value = control.value;

            return (
              value.passwordConfirm === value.password ||
              // avoid displaying the message error when values are empty
              (!value.passwordConfirm || !value.password)
            );
          },
          message: 'Password no coincide',
          errorPath: 'passwordConfirm'
        }
      },
      fieldGroup: [
        {
          key: 'password',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'Password',
            placeholder: 'Debe tener al menos 8 caracteres',
            required: true,
            minLength: 3
          }
        },
        {
          key: 'passwordConfirm',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'Confirma Password',
            placeholder: 'Ingresa password de nuevo',
            required: true
          }
        }
      ]
    }
  ];

  constructor(private userControllerService: UserControllerService, private router: Router) {}

  ngOnInit() {}

  registrar(model: any) {
    const user: User = model;

    user.password = model.password.password;

    this.userControllerService.userControllerCreate(user).subscribe(
      data => {
        this.router.navigate(['login']);
        const Toast = Swal.mixin({
          toast: false,
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          title: 'Bienvenido',
          toast: true,
          text: 'Usuario creado correctamente.',
          timer: 2500,
          position: 'center',
          type: 'success'
        });
      },
      error => {
        console.log(error);
      }
    );
  }
}
