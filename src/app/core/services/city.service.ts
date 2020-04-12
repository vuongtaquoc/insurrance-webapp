import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { City } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class CityService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getCities() {
    return this.http.get('/cities', {
    });
  }

  public getDetailById(id: string) {
    return this.http.get('/cities', {
      params: { id }
    });
  }

}
