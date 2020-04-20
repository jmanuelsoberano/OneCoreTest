import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserAuth } from './models/user-auth';
import { User } from './users/user.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as CryptoJS from 'crypto-js';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  securityObject: UserAuth = new UserAuth();
  tokenFromUI: string = "0123456789123456";
  encrypted: any = "";

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) { }

  isAuthenticated() {
    return localStorage.getItem('bearerToken') ? true: false;
  }

  resetSecutityObject() {
    this.securityObject.userName = '';
    this.securityObject.bearerToken = '';
    this.securityObject.isAuthenticated = false;
  }

  login(user: {name: string, password: string}) {

    this.resetSecutityObject();

    user.password = this.encrypt(user.password);
    return this.http.post(`${this.baseUrl}security/login`, user, httpOptions)
      .pipe(
        tap((resp: UserAuth) => {
          Object.assign(this.securityObject, resp);
          localStorage.setItem('bearerToken', this.securityObject.bearerToken);
        }),
        catchError(this.handleError)
      )
  }

  logout() {
    this.resetSecutityObject();
    localStorage.removeItem('bearerToken');
  }

  encrypt(password: string): string {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let encrypted = CryptoJS.AES.encrypt(
      password, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  decrypt(password: string): string {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

    return CryptoJS.AES.decrypt(
      password, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  handleError(err: any) {
    return throwError(err.error);
  }

}
