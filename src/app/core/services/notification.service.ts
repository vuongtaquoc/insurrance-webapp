import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private http: ApplicationHttpClient) {
  }

  public gets(filters = {}) {
    return this.http.getList('/notifications', {
      params: {
        ...filters
      }
    });
  }

  public getDetailById(id: string) {
    return this.http.get(`/notifications/${ id }`, {
    });
  }

  public create(body, options = {}) {
    return this.http.post('/notifications', body, options);
  }

  public update(id, body, options = {}) {
    return this.http.post(`/notifications/${ id }`, body, options);
  }

  public delete(id) {
    return this.http.delete(`/notifications/${ id }`);
  }


}
