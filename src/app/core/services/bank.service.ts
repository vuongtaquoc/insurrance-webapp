import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

// import { City } from '@app/core/models';

@Injectable({ providedIn: 'root' })
export class BankService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getBanks(): Observable<any> {
    return this.http.get('/bank');
  }
}
