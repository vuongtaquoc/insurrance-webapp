import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    return this.http.get('/agencies', {
      params: { id }
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

}
