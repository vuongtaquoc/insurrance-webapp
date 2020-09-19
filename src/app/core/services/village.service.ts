import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class VillageService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getVillage(wardsCode): Observable<any> {
    return this.http.get(`/village/wards/${ wardsCode }`);
  }
}
