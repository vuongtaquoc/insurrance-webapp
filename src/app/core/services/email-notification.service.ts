import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class EmailNotificationService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getList(filters = {}) {
    return this.http.getList('/emailActive', {
      params: {
        ...filters
      }
    });
  }

  public getDetailById(id: string) {
    return this.http.get(`/emailActive/${ id }`, {
    });
  }

  public create(body, options = {}) {
    return this.http.post('/emailActive', body, options);
  }

  public update(id, body, options = {}) {
    return this.http.post(`/emailActive/${ id }`, body, options);
  }

  public sendEmail(id, body, options = {}) {
    return this.http.post(`/emailActive/sendemail/${ id }`, body, options);
  }

  public delete(id) {
    return this.http.delete(`/emailActive/${ id }`);
  }
   
}
