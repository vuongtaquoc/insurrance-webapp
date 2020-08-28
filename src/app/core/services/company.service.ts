import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { Company } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class CompanyService {

  constructor(private http: ApplicationHttpClient) {
  }

  public filter(keyWord: string, orderType: string, orderby: string, skip: string, take: string): Observable<Company> {
    return this.http.get('/companies', {
      params: { keyWord, orderType, orderby, skip, take },
    });
  }

  public getDetailById(id: string) {
    return this.http.get(`/companies/${id}`);
  }

  public getDetailByCode(code: string) {
    return this.http.get(`/companies/code/${code}`);
  }

  public update(id, body, options: any = {}) {
    options.displayLoading = true;
    return this.http.post(`/companies/updatemycompany/${ id }`, body, options);
  }
  
}
