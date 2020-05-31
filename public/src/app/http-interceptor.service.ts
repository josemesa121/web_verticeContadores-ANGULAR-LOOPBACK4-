import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CredentialsService } from './core';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private credentialsService: CredentialsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;

    const token: string = localStorage.getItem('token');

    const credentials = this.credentialsService.credentials;
    if (credentials && credentials.token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${credentials.token}`
        }
      });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // this.errorDialogService.openDialog(event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        this.showAlert(error);
        let data = {};
        data = {
          reason: error && error.error && error.error.reason ? error.error.reason : '',
          status: error.status
        };
        // this.errorDialogService.openDialog(data);
        return throwError(error);
      })
    );
  }

  showAlert(error: HttpErrorResponse) {
    const Toast = Swal.mixin({
      toast: false,
      showConfirmButton: false,
      timer: 3000
    });

    switch (error.status) {
      case 401:
        console.log(error.error.error.message);
        if (error.error.error.message.includes('jwt expired')) {
          Toast.fire({
            title: 'Sesion Expirada',
            toast: false,
            text: 'Por favor logueate de nuevo.',
            timer: 3000,
            position: 'center',
            type: 'warning'
          });
        }
        this.router.navigate(['login']);
        break;
      case 422:
        console.log('en 422');
        console.log(error.error.error.code);
        if (error.error.error.code === 'VALIDATION_FAILED') {
          Toast.fire({
            title: 'Ooops!',
            toast: true,
            text: 'Datos incorrectos.',
            timer: 2000,
            position: 'bottom-right',
            type: 'warning'
          });
        }

        if (error.error.error.code === 'ER_DUP_ENTRY') {
          Toast.fire({
            title: '',
            toast: true,
            text: 'Registro ya existente.',
            timer: 2000,
            position: 'bottom-right',
            type: 'warning'
          });
        }

        break;
      case 500:
        Toast.fire({
          title: 'Ooops!',
          toast: true,
          text: 'Por favor intente de nuevo mas tarde.',
          timer: 2000,
          position: 'bottom-right',
          type: 'error'
        });
        break;

      default:
        break;
    }
  }
}
