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
      // Điều chỉnh
      case 'DC':
         note = 'Điều chỉnh tiền lương';
        break;
      case 'CD':
        note = 'Điều chỉnh chức danh';
        break;
       case 'DL':
        note = 'Điều chỉnh tham gia thất nghiệp';
        break;
      case 'TV':
        note = 'Tăng quỹ HTTT';
        break;
      case 'GV':
        note = 'Giảm quỹ HTTT';
        break;
      case 'DL':
        note = 'Điều chỉnh lương/điều chỉnh chức danh tham gia BH TNLĐ, BNN';
        break;
      default:
        // code block
    }

    return note;

  }

}
