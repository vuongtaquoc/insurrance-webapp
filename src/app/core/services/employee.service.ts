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
          label: employee.groupName,
          data: employee.groupName,
          expanded: true,
          styleClass: 'users-tree-parent',
          children: employee.employeers.map(e => ({
            ...e,
            label: e.fullName,
            data: e.fullName
          }))
        }));
      })
    );
  }
}
