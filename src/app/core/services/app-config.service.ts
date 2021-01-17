import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { Company } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class AppConfigService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getAppConfig() {
    return this.http.get(`/app-config`);
  }
  
}
