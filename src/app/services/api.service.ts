import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Storage} from '@capacitor/storage';
import {HttpOptions, WebRequest} from '../core/api-client';
import {environment} from '../../environments/environment';
import {Path} from '../core/path';

const TOKEN_KEY = 'my-token';


@Injectable({
  providedIn: 'root'
})
export abstract class ApiService {

  sessionToken = '';

  httpOptions = {
    headers: new HttpHeaders({
      authorization: `Bearer ${this.sessionToken}`,
      contentType: 'application/json'
    })
  };



  baseUrl = Path.join(environment.apiUrl, this.controller());

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);


  constructor(private http: HttpClient) {
    this.loadToken().catch(reason => console.error(reason));
  }


  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.sessionToken = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  async setAuthToken(token: string): Promise<void>{
    return await Storage.set({ key: TOKEN_KEY, value: token });
  }

  async removeAuthToken():  Promise<void>{
    return await Storage.remove({key: TOKEN_KEY});
  }


  protected request<TIn, TOut>(request: WebRequest<TIn>): Observable<TOut> {

    const options: HttpOptions<TIn> = {
      body: null,
      headers: null
    };

    if (request.body !== null) {
      options.body = request.body;
    }

    options.headers = this.httpOptions.headers;

    return this.http.request<TOut>(request.method.toString(), request.url, options);
  }

  abstract controller(): string;

}
