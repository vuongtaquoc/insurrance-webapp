import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: ApplicationHttpClient) {
  }

  public getEmployeeTrees() {
    return this.http.get('/employeers/declarations').pipe(
      map(employees => {
        return employees.map(employee => ({
          title: employee.groupName,
          expanded: true,
          children: employee.employeers.map(e => ({
            ...e,
            title: e.fullName
          }))
        }));
      })
    );
  }
}
