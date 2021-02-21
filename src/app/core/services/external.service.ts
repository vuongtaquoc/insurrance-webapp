import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';
import { AuthenticationService } from '@app/core/services/authentication.service';
// import { City } from '@app/core/models';

@Injectable({ providedIn: 'root' })
export class ExternalService {

  constructor(
    private http: ApplicationHttpClient,
    private authService: AuthenticationService
  ) {
  }

  public getEmployeeByIsurranceCode(code: string): Observable<any> {
    return this.http.get(`/external-sevice/isurranceCode/${code}`);
  }

  public getC12OfYear(year: string): Observable<any> {
    return this.http.get(`/external-sevice/list-c12/${year}`);
  }

  public downloadC12(year: string, month: string ) {
    return this.http.getFile(`/external-sevice/dowload-c12/${ month }/${ year }`, {
      headers: {
        token: this.authService.getCredentialToken()
      }
    });
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

  public getProcessDeclarationDocNo(docummentNo: string): Observable<any> {
    return this.http.get(`/external-sevice/process-document-no/${docummentNo}`);
  }

  public getProcessDeclarationOfCompany(declarationFileId: string): Observable<any> {
    return this.http.get(`/external-sevice/result-declaration-of-company/${declarationFileId}`);
  }

}
