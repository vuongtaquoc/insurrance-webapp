import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { PaymentMethod } from '@app/core/models';


@Injectable({ providedIn: 'root' })
export class PaymentStatusServiced {

  constructor(private http: ApplicationHttpClient) {
  }

  public getPaymentStatus(): Observable<PaymentMethod> {
    return this.http.get('/payment-status', {
    });
  }
  
  public getDetailById(id: string) {
    return this.http.get('/payment-status', {
      params: { id }
    });
  }
  
}
