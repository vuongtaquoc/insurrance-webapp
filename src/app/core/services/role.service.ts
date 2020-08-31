import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { ApplicationHttpClient } from '@app/core/http';


@Injectable({ providedIn: 'root' })
export class RoleService {

  constructor(private http: ApplicationHttpClient) {
  }

  public getList() {
    return this.http.get('/roles');
  }


   
}
