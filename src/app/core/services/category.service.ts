import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { Category } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class CategoryService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getCategories(type: string) {
    if (type === 'diagnosticCode') {
      return this.http.get(`/categories/type/${ type }`, {
      }).pipe(
        map(categories => {
          return categories.map(category => ({
            ...category,
            shortName: category.name.split(' - ')[0]
          }));
        })
      );
    }
    return this.http.get(`/categories/type/${ type }`, {
    });
  }

  public getCategoryByTypeAndCode(type, code) {
    return this.http.get(`/categories/type/${ type }/code/${code}`, {
    });
  }
}
