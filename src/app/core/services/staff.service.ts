import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class StaffService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getPermission(id){
    return this.http.getList('/customers', {
      params: {
        
      }
    });
  }

  public gets(filters = {}) {
<<<<<<< HEAD
    // return this.http.getList('/users', {
=======
>>>>>>> 7dc12aedb5abcbcffce4dc080a531d86b78d07ad
    return this.http.getList('/customers', {
      params: {
        ...filters
      }
    });
  }

  public getDetailById(id: string) {
<<<<<<< HEAD
    return this.http.get(`/users/${id}`, {
=======
    return this.http.get(`/customers/${ id }`, {
>>>>>>> 7dc12aedb5abcbcffce4dc080a531d86b78d07ad
    });
  }

  public create(body, options = {}) {
    return this.http.post('/customers', body, options);
  }

  public update(id, body, options = {}) {
<<<<<<< HEAD
    return this.http.post(`/users/${id}`, body, options);
  }

  public delete(id) {
    return this.http.delete(`/users/${id}`);
  }

  getOrganizationByTax(id?: any) {
    return new Promise((resolve, reject) => {
      try {
        eventEmitter.emit('saveData:loading', true);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://apicompany.newinvoice.vn/companies/' + id);
        xhr.responseType = 'json';
        xhr.setRequestHeader('X-Authorization-Token', 'NewInvoice');
        xhr.onload = function () {
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
=======
    return this.http.post(`/customers/${ id }`, body, options);
  }

  public delete(id) {
    return this.http.delete(`/customers/${ id }`);
  }
  
>>>>>>> 7dc12aedb5abcbcffce4dc080a531d86b78d07ad

}
