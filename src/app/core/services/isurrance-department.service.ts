import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { IsurranceDepartment } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class IsurranceDepartmentService {

  constructor(private http: ApplicationHttpClient) {
  }
  
  public getIsurranceDepartments(cityId: string): Observable<IsurranceDepartment> {
    return this.http.get(`/isurrance-department/city/${ cityId }`, {
    });
  }
  
  public getDetailById(id: string) {
    return this.http.get('/isurrance-department', {
      params: { id }
    });
  }
  
}
