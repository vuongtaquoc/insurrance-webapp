import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class ContractService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getList(filters = {}) {
    return this.http.getList('/contract', {
      params: {
        ...filters
      }
    });
  }

  public getDetailById(id: string) {
    return this.http.get(`/contract/${ id }`, {
    });
  }

  public getContractOfCompany() {
    return this.http.get('/contract/withcompany', {
    });
  }

  public create(body, options = {}) {
    return this.http.post('/contract', body, options);
  }

  public createCustomer(body, options = {}) {
    return this.http.postNoAuthen('/contract/customer', body, options);
  }

  public update(id, body, options = {}) {
    return this.http.post(`/contract/${ id }`, body, options);
  }

  public cancel(id, options = {}) {
    return this.http.post(`/contract/cancel/${ id }`, options);
  }

  public rednew(id, options = {}) {
    return this.http.post(`/contract/rednew/${ id }`, options);
  }

  public delete(id) {
    return this.http.delete(`/contract/${ id }`);
  }
   
}
