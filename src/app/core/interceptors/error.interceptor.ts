import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UNAUTHORIZED, NOT_FOUND, FORBIDDEN } from 'http-status-codes';

import { AuthenticationService } from '@app/core/services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private injector: Injector
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === NOT_FOUND) {
        this.router.navigate(['/404']);
        return;
      }

      if (err.status === UNAUTHORIZED) {
        // auto logout
        this.authenticationService.logout();
        location.href = '/auth/login';
        return;
      }

      if (err.status === FORBIDDEN) {
        this.router.navigate(['/']);

        return;
      }

      const error = err.error;
      const messageService = this.injector.get(NzMessageService);
      console.log(err);
      if (error && error.message) {
        messageService.create('error', error.message);
      } else {
        messageService.create('error', 'Có lỗi xảy ra, vui lòng thử lại!');
      }

      return throwError({
        status: err.status,
        error: err.error
      });
    }));
  }
}
