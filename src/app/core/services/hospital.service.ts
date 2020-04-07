import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

// import { City } from '@app/core/models';

@Injectable({ providedIn: 'root' })
export class HospitalService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getHospitals(cityId): Observable<any> {
    return this.http.get(`/hospital/city/${ cityId }`);
  }
}
