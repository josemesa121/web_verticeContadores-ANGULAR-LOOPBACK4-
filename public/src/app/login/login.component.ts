import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService, untilDestroyed, CredentialsService } from '@app/core';

import { UserControllerService } from '../../apiclient/api/userController.service';
import Swal from 'sweetalert2';
import { EmbedVideoService } from 'ngx-embed-video';
import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@app/services/user.service';
import { DataService } from '@app/services/data.service';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  youtubeUrl = 'https://www.youtube.com/embed/kvd5Mrjq3jc?rel=0';
  iframe_html: any;

  recoverEmail: any = '';

  errorMessage: any = '';

  noticias: [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private userControllerService: UserControllerService,
    private modalService: NgbModal,
    private userService: UserService,
    private dataService: DataService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getNoticias();
  }

  ngOnDestroy() {}

  getNoticias() {
    this.dataService
      .getNoticiasApiWordPress()
      .then(response => {
        this.noticias = response.data;
        // console.log(this.noticias);
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  login() {
    this.isLoading = true;
    /*
    this.userControllerService.userControllerLogin(this.loginForm.value).subscribe(data => {
      alert(data);
    });
    */

    const tempBody = {
      email: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    this.userControllerService.userControllerLogin(tempBody).subscribe(
      resp => {
        const credData = {
          username: this.loginForm.value.username,
          token: resp.token,
          userInfo: resp.user
        };
        this.credentialsService.setCredentials(credData, this.loginForm.value.remember);
        this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });

        const Toast = Swal.mixin({
          toast: false,
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          title: 'Bienvenido',
          toast: false,
          timer: 2500,
          position: 'center',
          type: 'success'
        });
      },
      err => {
        this.credentialsService.setCredentials();
        this.isLoading = false;

        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          title: 'Datos erroneos:',
          toast: true,
          text: 'intente de nuevo',
          type: 'error'
        });
      }
    );

    // const login$ = this.authenticationService.login(this.loginForm.value);
    // login$
    //   .pipe(
    //     finalize(() => {
    //       this.loginForm.markAsPristine();
    //       this.isLoading = false;
    //     }),
    //     untilDestroyed(this)
    //   )
    //   .subscribe(
    //     credentials => {
    //       log.debug(`${credentials.username} successfully logged in`);
    //       //this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
    //     },
    //     error => {
    //       log.debug(`Login error: ${error}`);
    //       this.error = error;
    //     }
    //   );
  }

  recoverPassword(form: any) {
    this.errorMessage = '';

    this.userService
      .recoverPassword(this.recoverEmail)
      .then(response => {
        if (response.data.status === 'ok') {
          form.reset();
          this.modalService.dismissAll();

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 8000
          });
          Toast.fire({
            title: 'Correo enviado',
            toast: true,
            text: 'por favor ingrese al correo y siga las instruciones.',
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

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }
}
