import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CredentialsService } from '@app/core';

import axios from 'axios';
const axiosClient = axios.create();

@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: any = '';

  constructor(private credentialsService: CredentialsService) {
    // tslint:disable-next-line: triple-equals
    if (this.credentialsService.credentials != null) {
      this.token = this.credentialsService.credentials.token;
    }
  }

  usersGet() {
    return axiosClient({
      method: 'get',
      url: environment.serverUrl + '/users/',
      headers: {
        Authorization: 'Bearer ' + this.token
      }
    });
  }

  userUpdate(user: any) {
    return axiosClient({
      method: 'patch',
      url: environment.serverUrl + '/users/' + user.id,
      headers: {
        Authorization: 'Bearer ' + this.token
      },
      data: user
    });
  }

  passwordUpdate(user: any) {
    return axiosClient({
      method: 'patch',
      url: environment.serverUrl + '/users/update-password/' + user.user.id,
      headers: {
        Authorization: 'Bearer ' + this.token
      },
      data: user
    });
  }

  recoverPassword(email: string) {
    return axiosClient({
      method: 'post',
      url: environment.serverUrl + '/recover-password/',
      data: { email: email }
    });
  }

  resetPassword(data: any) {
    return axiosClient({
      method: 'patch',
      url: environment.serverUrl + '/reset-password/',
      data: data
    });
  }

  deleteUser(data: any) {
    return axiosClient({
      method: 'delete',
      url: environment.serverUrl + '/users/' + data.id,
      headers: {
        Authorization: 'Bearer ' + this.token
      }
    });
  }
}
