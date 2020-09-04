import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class AccountService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getList(filters = {}) {
    return this.http.getList('/accounts', {
      params: {
        ...filters
      }
    });
  }

  public getDetailById(id: string) {
    return this.http.get(`/accounts/${ id }`, {
    });
  }

  public create(body, options = {}) {
    return this.http.post('/accounts', body, options);
  }

  public update(id, body, options = {}) {
    return this.http.post(`/accounts/${ id }`, body, options);
  }

  public delete(id) {
    return this.http.delete(`/accounts/${ id }`);
  }

  public getAccountOfCompany(companyId: string) {
    return this.http.get(`/accounts/account-default/${ companyId }`, {
    });
  }

  public createUserAgency(body, options = {}) {
    return this.http.post('/accounts/agency-account', body, options);
  }

  public createUserCustomer(body, options = {}) {
    return this.http.post('/accounts/customer-account', body, options);
  }

  public sendEmail(body, options = {}) {
    return this.http.post('/accounts/send-mail-account', body, options);
  }
 
   
}
