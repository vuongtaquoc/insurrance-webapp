import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

// import { City } from '@app/core/models';

@Injectable({ providedIn: 'root' })
export class DepartmentService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getDepartments(): Observable<any> {
    return this.http.get('/department').pipe(
      map(departments => {
        return departments.map(department => ({
          ...department,
          name: `${ department.code } - ${ department.name }`,
          shortName: department.name
        }));
      })
    );
  }

  public getDepartmentShortName(): Observable<any> {
    return this.http.get('/department').pipe(
      map(departments => {
        return departments.map(department => ({
          ...department,
        }));
      })
    );
  }
}
