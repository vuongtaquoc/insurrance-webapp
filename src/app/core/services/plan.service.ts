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
          shortName: plan.name
        }));
      })
    );
  }

  public getPlanShowCode(declarationCode: string): Observable<Plan> {
    return this.http.get(`/plan/declaration-code/${ declarationCode }`, {
    }).pipe(
      map(hospitals => {
        return hospitals.map(plan => ({
          ...plan,
          name: `${ plan.id } - ${ plan.name }`,
          shortName: plan.id
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
          shortName: plan.name
        }));
      })
    );
  }

  public getDetailByCode(code: string) {
    return this.http.get(`/plan/code/${ code }`).pipe(
      map(detail => {
        return detail;
      })
    );
  }

  public getDetailByIdShowCode(id: string) {
    return this.http.get('/plan', {
      params: { id }
    }).pipe(
      map(hospitals => {
        return hospitals.map(plan => ({
          ...plan,
          name: `${ plan.id } - ${ plan.name }`,
          shortName: plan.id
        }));
      })
    );
  }
}
