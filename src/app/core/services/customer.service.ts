import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class CustomerService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getCustomers(filters = {}) {
    return this.http.getList('/customers', {
      params: {
        ...filters
      }
    });
  }

  public getDetailById(id: string) {
    return this.http.get('/customers', {
      params: { id }
    });
  }

  public create(body, options = {}) {
    return this.http.post('/customers', body, options);
  }

  public update(id, body, options = {}) {
    return this.http.post(`/customers/${ id }`, body, options);
  }

  public delete(id) {
    return this.http.delete(`/customers/${ id }`);
  }

}
