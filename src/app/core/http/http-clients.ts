import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RequestOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
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

  post<T>(endpoint: string, body: any | null, options?: RequestOptions): Observable<any> {
    return this.http.post<any>(endpoint, body, options)
      .pipe(map(data => this.handleResponse(data)));
  }

  put<T>(endpoint: string, body: any | null, options?: RequestOptions): Observable<any> {
    return this.http.put<any>(endpoint, body, options)
      .pipe(map(data => this.handleResponse(data)));
  }

  delete<T>(endpoint: string, options?: RequestOptions): Observable<any> {
    console.log(endpoint, options)
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