import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserAuth } from './models/user-auth';
import { User } from './users/user.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  securityObject: UserAuth = new UserAuth();

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

  handleError(err: any) {
    return throwError(err.error);
  }

}
