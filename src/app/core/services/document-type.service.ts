import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { DocumentType } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class DocumentTypeService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getCategories(): Observable<DocumentType> {
    return this.http.get('/document-types/categories', {
    });
  }
  
  public getDetailByGroupCode(groupCode: string) {
    return this.http.get('/document-types', {
      params: { groupCode }
    });
  }
  
}
