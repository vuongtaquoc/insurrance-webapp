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

  public getNoteByPlanCode(planCode, employee) {
    let note = '';
    switch(planCode) {
      // �i?u ch?nh
      case 'DC':
         note = '�i?u ch?nh ti?n luong';
        break;
      case 'CD':
        note = '�i?u ch?nh ch?c danh';
        break;
       case 'DL':
        note = '�i?u ch?nh tham gia th?t nghi?p';
        break;
      case 'TV':
        note = 'Tang qu? HTTT';
        break;
      case 'GV':
        note = 'Gi?m qu? HTTT';
        break;
      case 'DL':
        note = '�i?u ch?nh luong/di?u ch?nh ch?c danh tham gia BH TNL�, BNN';
        break;
      default:
        // code block
    }

    return note;

  }

}
