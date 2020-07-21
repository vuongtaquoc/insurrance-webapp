import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { Plan } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class PlanService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getPlans(declarationCode: string): Observable<Plan> {
    return this.http.get(`/plan/declaration-code/${ declarationCode }`, {
    }).pipe(
      map(hospitals => {
        return hospitals.map(plan => ({
          ...plan,
          name: `${ plan.id } - ${ plan.name }`,
          shortName: plan.shortName
        }));
      })
    );
  }

  public getDetailById(id: string) {
    return this.http.get('/plan', {
      params: { id }
    }).pipe(
      map(hospitals => {
        return hospitals.map(plan => ({
          ...plan,
          name: `${ plan.id } - ${ plan.name }`,
          shortName: plan.shortName
        }));
      })
    );
  }

}
