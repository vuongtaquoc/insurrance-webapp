import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
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
    return this.http.get(`/customers/${ id }`, {
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

  public getOrganizationByTax(id?: any) {
    return new Promise((resolve, reject) => {
        try {
            eventEmitter.emit('saveData:loading', true);
            const xhr = new XMLHttpRequest();
            xhr.open('GET',  'https://mst.minvoice.com.vn/api/System/SearchTaxCode?tax=' + id);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if (xhr.status === 200 && xhr.response && xhr.response) {
                    resolve(xhr.response);
                    eventEmitter.emit('saveData:loading', false);
                } else {
                    reject();
                    eventEmitter.emit('saveData:loading', false);
                }
            };
            xhr.send();
            
        } catch (error) {
            reject(error);
            eventEmitter.emit('saveData:loading', false);
        }
    });
}

}
