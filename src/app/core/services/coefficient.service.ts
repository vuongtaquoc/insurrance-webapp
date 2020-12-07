import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

// import { City } from '@app/core/models';

@Injectable({ providedIn: 'root' })
export class CoefficientService {

  constructor(private http: ApplicationHttpClient) {
  }

  public filter(): Observable<any> {
    return this.http.get('/coefficient', {
    }).pipe(
      map(coefficients => {
        return coefficients.map(coefficient => ({
          ...coefficient,
          name: `${ coefficient.id } - ${ coefficient.name }`,
        }));
      })
    );;
  }
  
  public getDetail(code): Observable<any> {
    return this.http.get(`/coefficient/${code}`);
  }
   
}
