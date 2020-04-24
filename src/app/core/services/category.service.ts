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
    return this.http.get(`/categories/type/${ type }`, {
    });
  }


}
