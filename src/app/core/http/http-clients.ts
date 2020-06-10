import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ErrorMessage } from '@app/shared/constant';

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
}

export function applicationHttpClientCreator(http: HttpClient) {
  return new ApplicationHttpClient(http);
}

@Injectable()
export class ApplicationHttpClient {
  constructor(public http: HttpClient ) {}

  get<T>(endpoint: string, options?: RequestOptions): Observable<any> {
    return this.http.get<any>(endpoint, options)
      .pipe(map(data => this.handleResponse(data)));
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
    return this.http.post<any>(endpoint, body, options)
      .pipe(map(data => this.handleResponse(data)));
  }

  put<T>(endpoint: string, body: any | null, options?: RequestOptions): Observable<any> {
    return this.http.put<any>(endpoint, body, options)
      .pipe(map(data => this.handleResponse(data)));
  }

  delete<T>(endpoint: string, options?: RequestOptions): Observable<any> {
    return this.http.delete<any>(endpoint, options)
      .pipe(map(data => this.handleResponse(data)));
  }

  patch<T>(endpoint: string, body: any | null, options?: RequestOptions): Observable<any> {
    return this.http.patch<any>(endpoint, body, options)
      .pipe(map(data => this.handleResponse(data)));
  }

  private handleResponse(data) {
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
    const message = ErrorMessage[errorCode];
    if(!message) {
      return ErrorMessage[8];
    }
    
    return message;
  }
}
