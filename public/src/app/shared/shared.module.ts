import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiModule } from '../../apiclient/api.module';
import { LoaderComponent } from './loader/loader.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Configuration, ConfigurationParameters } from 'src/apiclient';
import { environment } from '@env/environment';

import { WeekPickerComponent } from './../components/week-picker/week-picker.component';
import { FormlyFieldFile } from '@app/formly-custom/file-type.component';
import { DocumentoService } from '@app/services/documento';
import { FileValueAccessor } from '@app/formly-custom/file-value-accessor';
import { TableSkeletonLoaderComponent } from './table-skeleton-loader/table-skeleton-loader.component';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ButtonSkeletonLoaderComponent } from './button-skeleton-loader/button-skeleton-loader.component';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: environment.serverUrl
  };
  return new Configuration(params);
}

@NgModule({
  imports: [
    CommonModule,
    ApiModule.forRoot(apiConfigFactory),
    FormsModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      types: [{ name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] }]
    }),
    NgbModule,
    SweetAlert2Module.forRoot(),
    NgxSkeletonLoaderModule
  ],
  declarations: [
    LoaderComponent,
    WeekPickerComponent,
    FormlyFieldFile,
    FileValueAccessor,
    TableSkeletonLoaderComponent,
    ButtonSkeletonLoaderComponent
  ],
  exports: [
    LoaderComponent,
    WeekPickerComponent,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    NgbModule,
    SweetAlert2Module,
    FileValueAccessor,
    NgxSkeletonLoaderModule,
    TableSkeletonLoaderComponent,
    ButtonSkeletonLoaderComponent
  ],
  providers: [DocumentoService]
})
export class SharedModule {}
