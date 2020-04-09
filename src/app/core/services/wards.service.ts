import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { Wards } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class WardsService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getWards(districtCode: string): Observable<Wards> {
    return this.http.get(`/wards/district/${ districtCode }`, {
    });
  }
  
  public getDetailById(id: string) {
    return this.http.get('/wards', {
      params: { id }
    });
  }
  
}
