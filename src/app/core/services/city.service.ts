import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { DocumentType } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class CityService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getCities(): Observable<DocumentType> {
    return this.http.get('/cities', {
    });
  }
  
  public getDetailById(id: string) {
    return this.http.get('/cities', {
      params: { id }
    });
  }
  
}
