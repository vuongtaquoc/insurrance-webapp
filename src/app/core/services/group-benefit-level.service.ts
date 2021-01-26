import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

// import { City } from '@app/core/models';

@Injectable({ providedIn: 'root' })
export class GroupBenefitLevelService {

  constructor(private http: ApplicationHttpClient) {
  }

  public filter(): Observable<any> {
    return this.http.get('/group-benefitLevel', {
    }).pipe(
      map(benefitLevels => {
        return benefitLevels.map(benefitLevel => ({
          ...benefitLevel,
          name: `${ benefitLevel.id } - ${ benefitLevel.name }`,
          shortName:benefitLevel.id,
        }));
      })
    );;
  }
  
  public getById(id): Observable<any> {
    return this.http.get(`/group-benefitLevel/${id}`);
  }

  public getBylevel(level): Observable<any> {
    return this.http.get(`/group-benefitLevel/level/${level}`);
  }
   
}
