import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import axios from 'axios';
import { UserService } from './user.service';
const axiosClient = axios.create();

declare var require: any;
const FileSaver = require('file-saver');

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private userService: UserService) {}

  updateObligacion(data: any) {
    return axiosClient({
      method: 'patch',
      url: environment.serverUrl + '/obligacion/' + data.id,
      headers: {
        Authorization: 'Bearer ' + this.userService.token
      },
      data: {
        nombre: data.nombre
      }
    });
  }

  updateFechaObligacion(data: any) {
    return axiosClient({
      method: 'put',
      url: environment.serverUrl + '/obligacion-fecha/' + data.id,
      headers: {
        Authorization: 'Bearer ' + this.userService.token
      },
      data: data
    });
  }

  exportExcelObligacionesRango(data: any) {
    return axiosClient({
      method: 'post',
      url: environment.serverUrl + '/empresas/export-obligaciones-rango',
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.ms-excel',
        Authorization: 'Bearer ' + this.userService.token
      },
      data: data
    });
  }

  download(path: string, fileName: string) {
    const url = environment.serverUrl + '/' + path;
    FileSaver.saveAs(url, fileName);
  }

  getNoticiasApiWordPress() {
    return axiosClient({
      method: 'get',
      url: 'http://verticeaccounts.com/wp-json/wp/v2/posts?per_page=3',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
