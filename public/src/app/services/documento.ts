import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Documento, Configuration } from 'src/apiclient';

import { BASE_PATH, COLLECTION_FORMATS } from '../../apiclient/variables';
import { environment } from '@env/environment';

declare var require: any;
const FileSaver = require('file-saver');

@Injectable()
export class DocumentoService {
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  protected basePath = 'http://localhost:3000';
  protected environment = environment;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  public upload(empresaId: number, body: any): Observable<any> {
    if (empresaId === null || empresaId === undefined) {
      // tslint:disable-next-line: max-line-length
      throw new Error(
        'Required parameter empresaId was null or undefined when calling documentoControllerUploadDocumento.'
      );
    }

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'multipart/form-data');

    return this.httpClient.post<Documento>(
      `${this.basePath}/documentos/upload/${encodeURIComponent(String(empresaId))}`,
      body,
      {
        withCredentials: this.configuration.withCredentials
        // headers,
        // observe: observe,
        // reportProgress: reportProgress
      }
    );
  }

  download(documento: any) {
    const pdfUrl = environment.serverUrl + '/' + documento.path;
    const pdfName = 'Documento-' + documento.id;
    FileSaver.saveAs(pdfUrl, pdfName);
  }
}
