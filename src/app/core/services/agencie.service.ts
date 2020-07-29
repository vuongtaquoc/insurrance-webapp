import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class AgencieService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getAgencies(filters = {}) {
    return this.http.getList('/agencies', {
      params: {
        ...filters
      }
    });
  }

  public getDetailById(id: string) {
    return this.http.get(`/agencies/${ id }`, {
    });
  }

  public create(body, options = {}) {
    return this.http.post('/agencies', body, options);
  }

  public update(id, body, options = {}) {
    return this.http.post(`/agencies/${ id }`, body, options);
  }

  public delete(id) {
    return this.http.delete(`/agencies/${ id }`);
  }

  getOrganizationByTax(id?: any) {
    return new Promise((resolve, reject) => {
        try {
            eventEmitter.emit('saveData:loading', true);
            const xhr = new XMLHttpRequest();
            xhr.open('GET',  'http://apicompany.newinvoice.vn/companies/' + id);
            xhr.responseType = 'json';
            xhr.setRequestHeader('X-Authorization-Token', 'NewInvoice');
            xhr.onload = function() {
                if (xhr.status === 200 && xhr.response && xhr.response.data) {
                    resolve(xhr.response.data);
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
