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

  public getDetailByName(name: string) {
    return this.http.get(`/bank/detail/${name}`);
  }


  public filterBank(filters = {}) {
    return this.http.getList('/bank', {
      params: {
        ...filters
      }
    }).pipe(
      map(categories => {
        return categories.data.map(category => ({
          ...category,
          name: category.id + ' - ' + category.name,
          shortName: category.name
        }));
      })
    );
  }

  public filterBankNotDisplayCode(filters = {}) {
    return this.http.getList('/bank', {
      params: {
        ...filters
      }
    }).pipe(
      map(categories => {
        return categories.data.map(category => ({
          ...category,
          shortName: category.name
        }));
      })
    );
  }
  
}
