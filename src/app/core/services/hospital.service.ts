import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

// import { City } from '@app/core/models';

@Injectable({ providedIn: 'root' })
export class HospitalService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getHospitals(cityCode): Observable<any> {
    return this.http.get(`/hospital/city/${ cityCode }`).pipe(
      map(hospitals => {
        return hospitals.map(hospital => ({
          ...hospital,
          name: `${ hospital.id } - ${ hospital.name }`,
          shortName: hospital.shortName
        }));
      })
    );
  }

  public searchHospital(cityCode, name = ''): Observable<any> {
    return this.http.get('/hospital', {
      params: {
        cityCode,
        name
      }
    }).pipe(
      map(hospitals => {
        return hospitals.map(hospital => ({
          ...hospital,
          name: `${ hospital.id } - ${ hospital.name }`,
          shortName: hospital.shortName
        }));
      })
    );
  }

  public getById(id): Observable<any> {
    return this.http.get(`/hospital/code/${id}`);
  }

  public create(body, options = {}) {
    return this.http.post('/hospital', body, options);
  }
}
