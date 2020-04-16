import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { DocumentList } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class DocumentListService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getDocumentList(category: string ): Observable<any> {
    return this.http.get(`/document-list/category/${ category }`, {
    });
  }
  
  public getDetailById(id: string) {
    return this.http.get('/document-list/', {
      params: { id }
    });
  }
  
}
