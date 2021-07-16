import {Injectable} from '@angular/core';

import {Storage} from '@capacitor/storage';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';
import {ApiService} from './api.service';
import {ApiResponse, WebRequest, WebRequestMethod, WebResponse} from '../core/api-client';
import {Path} from '../core/path';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ApiService {


  login(model: LoginRequestDto): Observable<any> {

    const request: WebRequest<LoginRequestDto> = {
      url: Path.join(this.baseUrl, 'login'),
      method: WebRequestMethod.post,
      body: model
    };

    return this.request<LoginRequestDto, WebResponse<LoginResponseDto>>(request)
      .pipe(
        map((response: WebResponse<LoginResponseDto>) => {
          const loginResponse = ApiResponse.getFirstItem(response);

          this.setAuthToken(loginResponse.token)
            .catch(reason => console.error(reason));
        }),
        tap(_ => {
          this.isAuthenticated.next(true);
        }));
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return this.removeAuthToken();
  }

  controller(): string {
    return 'auth';
  }

}

export class LoginRequestDto {
  username: string;
  password: string;

  constructor(model?: any) {
    this.username = model.username;
    this.password = model.password;
  }
}

export class LoginResponseDto {
  token: string | null;

  constructor() {
    this.token = null;
  }
}
