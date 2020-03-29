import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/core/services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentCredentials = this.authenticationService.currentCredentials;

    if (currentCredentials && currentCredentials.token) {
      request = request.clone({
        setHeaders: {
          'X-Authorization-Token': currentCredentials.token
        }
      });
    }

    return next.handle(request);
  }
}
