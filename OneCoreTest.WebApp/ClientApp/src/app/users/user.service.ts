import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { tap, catchError, map, switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
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
        )
      );
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}users/${id}`);
  }

}
