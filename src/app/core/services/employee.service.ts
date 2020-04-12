import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import uuid from 'uuid';

import { ApplicationHttpClient } from '@app/core/http';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: ApplicationHttpClient) {
  }

  public getEmployeeTrees() {
    return this.http.get('/employeers/declarations').pipe(
      map(employees => {
        return employees.map(employee => {
          const parentKey = uuid.v4();

          return {
            title: employee.groupName,
            expanded: true,
            key: parentKey,
            children: employee.employeers.map(e => ({
              ...e,
              title: e.fullName,
              key: e.id,
              isLeaf: true
            }))
          };
        });
      })
    );
  }

  public create(data) {

  }
}
