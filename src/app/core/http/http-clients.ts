import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import toastr from 'toastr';

import { errorMessages } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

import { environment } from '@config';

export interface RequestOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: any;
  params?: HttpParams | {
    [param: string]: any;
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
  displayLoading?: boolean;
}

export function applicationHttpClientCreator(http: HttpClient) {
  return new ApplicationHttpClient(http);
}

@Injectable()
export class ApplicationHttpClient {
  constructor(public http: HttpClient ) {}

  get<T>(endpoint: string, options?: RequestOptions): Observable<any> {
    if (options && options.displayLoading) {
      eventEmitter.emit('saveData:loading', true);
    }

    return this.http.get<any>(endpoint, options)
      .pipe(map(data => this.handleResponse(data, options && options.displayLoading)));
  }

  getList<T>(endpoint: string, options?: RequestOptions): Observable<any> {
    return this.http.get<any>(endpoint, {
      ...options,
      observe: 'response'
    })
      .pipe(map(res => {
        const body = res.body;

        if (body.code === 1) {
          return {
            total: res.headers.get('X-Collection-Total') || 0,
            data: body.data
          }
        }

        return throwError({
          code: body.code,
          message: body.message
        });
      }));
  }

  getFile<T>(endpoint: string, options: any = {}) {
    return new Promise((resolve, reject) => {
      const url = `${environment.apiUrl}${environment.apiPrefix}${endpoint}`;
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'arraybuffer';

      xhr.addEventListener('readystatechange', function() {
        if(this.readyState === 4) {
          return resolve(xhr.response);
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('X-Authorization-Token', options.headers.token);

      xhr.send();
    });
  }

  post<T>(endpoint: string, body: any | null, options?: RequestOptions): Observable<any> {
    if (options && options.displayLoading) {
      eventEmitter.emit('saveData:loading', true);
    }

    return this.http.post<any>(endpoint, body, options)
      .pipe(map(data => this.handleResponse(data, options && options.displayLoading)));
  }

  put<T>(endpoint: string, body: any | null, options?: RequestOptions): Observable<any> {
    if (options && options.displayLoading) {
      eventEmitter.emit('saveData:loading', true);
    }

    return this.http.put<any>(endpoint, body, options)
      .pipe(map(data => this.handleResponse(data, options && options.displayLoading)));
  }

  delete<T>(endpoint: string, options?: RequestOptions): Observable<any> {
    if (options && options.displayLoading) {
      eventEmitter.emit('saveData:loading', true);
    }

    return this.http.delete<any>(endpoint, options)
      .pipe(map(data => this.handleResponse(data, options && options.displayLoading)));
  }

  patch<T>(endpoint: string, body: any | null, options?: RequestOptions): Observable<any> {
    if (options && options.displayLoading) {
      eventEmitter.emit('saveData:loading', true);
    }

    return this.http.patch<any>(endpoint, body, options)
      .pipe(map(data => this.handleResponse(data, options && options.displayLoading)));
  }

  private handleResponse(data, displayLoading) {
    if (displayLoading) {
      eventEmitter.emit('saveData:loading', false);
    }

    if (data.code === 1) {
      return data.data;
    }

    throw {
      code: data.code,
      message: this.getMessageErrorByErrorCode(data.code),
    };

  }

  private getMessageErrorByErrorCode(errorCode)
  {
    const message = errorMessages[errorCode];

    if (!message) {
      toastr.error(errorMessages[8]);
      return errorMessages[8];
    }

    toastr.error(message);
    return message;
  }
}
