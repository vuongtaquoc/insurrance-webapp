import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { Plan } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class PlanService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getPlans(): Observable<any> {
    return this.http.get('/plan', {
    });
  }
  
  public getDetailById(id: string) {
    return this.http.get('/wards', {
      params: { id }
    });
  }
  
}
