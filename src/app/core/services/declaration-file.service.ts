import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import findLastIndex from 'lodash/findLastIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';

import { ApplicationHttpClient } from '@app/core/http';

@Injectable({ providedIn: 'root' })
export class DeclarationFileService {
  constructor(private http: ApplicationHttpClient) {
  }

  public getDeclarationFiles(declarationId: string ): Observable<any> {
    return this.http.get(`/declaration-file/declaration/${ declarationId }`, {
    });
  }

  public getDetailById(id: string) {
    return this.http.get('/declaration-file/', {
      params: { id }
    });
  }

  public downloadDeclarationFile(declarationId: string ): Observable<any> {
    return this.http.getFile(`/declaration-file/download/${ declarationId }`, {
      responseType: 'arraybuffer'
    });
  }

}
