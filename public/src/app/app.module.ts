import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from './material.module';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { EmpresaModule } from './empresa/empresa.module';
import { ObligacionModule } from './obligacion/obligacion.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserModule } from './user/user.module';
import { HttpInterceptorService } from './http-interceptor.service';
import { EmbedVideo } from 'ngx-embed-video';
import { DragDropDirective } from './drag-drop.directive';
//import { UploadFileComponent } from './upload-file/upload-file.component';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule,
    CoreModule,
    SharedModule,
    ShellModule,
    MaterialModule,
    HomeModule,
    EmpresaModule,
    UserModule,
    ObligacionModule,
    UsersModule,
    LoginModule,
    AppRoutingModule,

    EmbedVideo.forRoot() // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent, DragDropDirective],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
