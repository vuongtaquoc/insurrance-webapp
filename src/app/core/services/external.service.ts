import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

// import { City } from '@app/core/models';

@Injectable({ providedIn: 'root' })
export class ExternalService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getEmployeeByIsurranceCode(code: string): Observable<any> {
    return this.http.get(`/external-sevice/isurranceCode/${code}`);
  }

  public getIsurranceCode(body, options: any = {}) {
    options.displayLoading = true;
    return this.http.post('/external-sevice/isurrance-code', body, options);
  }

  public getResultReceptionDocment(documentNo: string): Observable<any> {
    return this.http.get(`/external-sevice/result-declaration/${documentNo}`);
  }

  public getProcessDeclaration(declarationFileId: string): Observable<any> {
    return this.http.get(`/external-sevice/process-document/${declarationFileId}`);
  }

}
