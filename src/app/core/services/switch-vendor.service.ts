import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

@Injectable({ providedIn: 'root' })
export class SwitchVendorService {

  constructor(private http: ApplicationHttpClient) {
  }


  public getById(id): Observable<any> {
    return this.http.get(`/switchVendor/${id}`);
  }
   
  public create(body, options = {}) {
    return this.http.post('/switchVendor', body, options);
  }

  public update(id, body, options: any = {}) {
    options.displayLoading = true;

    return this.http.post(`/switchVendor/${ id }`, body, options);
  }

  public getDraft(): Observable<any> {
    return this.http.get('/switchVendor/draft');
  }
}
