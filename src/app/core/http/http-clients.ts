import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

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
  constructor(public http: HttpClient) {}

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

  getFile<T>(endpoint: string, options: any = {}): Observable<any> {
    options.observe = 'response';

    return this.http.get<T>(endpoint, options);
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
    return this.http.delete<any>(endpoint, options);
  }

  patch<T>(endpoint: string, body: any | null, options?: RequestOptions): Observable<any> {
    return this.http.patch<any>(endpoint, body, options)
      .pipe(map(data => this.handleResponse(data)));
  }

  private handleResponse(data) {
    if (data.code === 1) {
      return data.data;
    }

    return throwError({
      code: data.code,
      message: data.message
    });
  }
}
