import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { District } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class DistrictService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getDistrict(cityCode: string) {
    return this.http.get(`/district/city/${ cityCode }`, {
    });
  }

  public getDetailById(id: string) {
    return this.http.get('/district', {
      params: { id }
    });
  }

}
