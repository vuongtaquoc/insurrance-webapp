import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@config';

@Injectable({
  providedIn: 'root'
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!/^(http|https):/i.test(request.url)) {
      const url = request.url.indexOf('/assets/i18n') === -1 ?
        `${environment.apiUrl}${environment.apiPrefix}${request.url}` :
        request.url;

      request = request.clone({
        url
      });
    }

    return next.handle(request);
  }
}
