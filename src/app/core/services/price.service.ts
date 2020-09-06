import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';
import { Price } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class PriceService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getList(filters = {}) {
    return this.http.getList('/price', {
        params: {
            ...filters
        }
    });
}

  public getById(id): Observable<any> {
    return this.http.get(`/price/${id}`);
  }

  public create(body, options = {}) {
    return this.http.post('/price', body, options);
  }

  public update(id, body, options: any = {}) {
    options.displayLoading = true;

    return this.http.post(`/price/${ id }`, body, options);
  }

  public delete(id) {
    return this.http.delete(`/price/${ id }`);
  }

}
