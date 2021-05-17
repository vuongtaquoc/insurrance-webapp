import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import findLastIndex from 'lodash/findLastIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';

import { ApplicationHttpClient } from '@app/core/http';
import { AuthenticationService } from '@app/core/services/authentication.service';

@Injectable({ providedIn: 'root' })
export class DeclarationFileService {
  constructor(
    private http: ApplicationHttpClient,
    private authService: AuthenticationService
  ) {
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

  public downloadDeclarationFile(declarationId: string , type: string) {
    let root = '/declaration-file/download';
    if (type === '.pdf') {
      root = '/declaration-file/download-pdf';
    }
    return this.http.getFile(`${root}/${ declarationId }`, {
      headers: {
        token: this.authService.getCredentialToken()
      }
    });
  }

}
