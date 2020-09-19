import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { SalaryArea } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class SalaryAreaService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getSalaryAreas(): Observable<any> {
    return this.http.get('/salary-area', {
    });
  }
  
  public getDetailById(id: string) {
    return this.http.get('/salary-area', {
      params: { id }
    });
  }
  
}
