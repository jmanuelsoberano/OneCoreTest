import { Injectable, NgModule } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('bearerToken');

    if (token) {
      const newReq = req.clone(
        {
          headers: req.headers.set('Authorization', 'Bearer ' + token)
        }
      )
      return next.handle(newReq).pipe(
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse) {
            try {
              if (err.status === 401) {
                this.securityService.logout();
                this.router.navigate(['/login']);
              }
            } catch (e) {
              //catch
            }
          }
          return of(err);
        }));
    } else {
      return next.handle(req);
    }
  }

}

@NgModule({
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true
  }]
})
export class HttpInterceptorModule { }

