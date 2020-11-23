import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

// import { City } from '@app/core/models';

@Injectable({ providedIn: 'root' })
export class DeclarationConfigService {

  constructor(private http: ApplicationHttpClient) {
  }

  public filter(): Observable<any> {
    return this.http.get('/declaration-config');
  }

  public getDetailByCode(code: string) {
    return this.http.get(`/declaration-config/detail/${code}`);
  }
  
}
