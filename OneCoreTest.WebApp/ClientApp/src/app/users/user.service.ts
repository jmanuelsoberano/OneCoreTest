import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { tap, catchError, map, switchMap } from 'rxjs/operators'
import { throwError } from 'rxjs';
import { SecurityService } from '../security.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private securityService: SecurityService,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {
  }

  getUsers() {
    return this.http.get<User[]>(this.baseUrl + 'users')
      .pipe(
        map((m: []) =>
          m.map((user: any) => {
            return {
              id: user.id,
              usuario: user.name,
              correo: user.email,
              sexo: user.gender,
              estatus: user.status ? 'Activo' : 'Inactivo'
            } as User
          })
        ),
        catchError(this.handleError)
      );
  }

  getUser(id: string) {
    return this.http.get(`${this.baseUrl}users/${id}`)
      .pipe(
        map((m:any) => ({
          id: m.id,
          email: m.email,
          name: m.name,
          password: this.securityService.decrypt(m.password),
          status: m.status,
          gender: m.gender,
          creationDate: m.creationDate,
          }))
      );
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}users/${id}`);
  }

  newUser(user: any) {
    user.password = this.securityService.encrypt(user.password);
    return this.http.post(`${this.baseUrl}users`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUser(user: any) {
    user.password = this.securityService.encrypt(user.password);
    return this.http.put(`${this.baseUrl}users/${user.id}`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(err: any) {
    return throwError(err.error);
  }

}
