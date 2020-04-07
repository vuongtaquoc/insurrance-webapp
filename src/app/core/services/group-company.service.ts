import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { GroupCompany } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class GroupCompanyService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getGroupCompany(): Observable<GroupCompany> {
    return this.http.get('/group', {
    });
  }
  
  public getDetailById(id: string) {
    return this.http.get('/group', {
      params: { id }
    });
  }
  
}
