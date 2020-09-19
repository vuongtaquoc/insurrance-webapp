import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

@Injectable({ providedIn: 'root' })
export class WardsService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getWards(districtCode: string) {
    return this.http.get(`/wards/district/${ districtCode }`, {
    });
  }

  public getDetailById(id: string) {
    return this.http.get('/wards', {
      params: { id }
    });
  }

}
