import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ApplicationHttpClient } from '@app/core/http';

import { Credential } from '@app/core/models';

const CREDENTIAL_STORAGE = 'CREDENTIALS';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private credentialSubject: BehaviorSubject<Credential>;
  public credentials: Observable<Credential>;

  constructor(private http: ApplicationHttpClient) {
    this.credentialSubject = new BehaviorSubject<Credential>(JSON.parse(localStorage.getItem(CREDENTIAL_STORAGE)));
    this.credentials = this.credentialSubject.asObservable();
  }

  public get currentCredentials(): Credential {
    return JSON.parse(localStorage.getItem(CREDENTIAL_STORAGE));
  }

  public login(userId: string, password: string): Observable<any> {
    return this.http.post('/session/login', {
      userId,
      password
    })
    .pipe(
      map(data => {
        return this.storeCredentials(data);
      })
    );
  }

  public logout() {
    this.http.delete('/session/logout').toPromise();

    localStorage.removeItem(CREDENTIAL_STORAGE);
    this.credentialSubject.next(null);
  }

  public requestResetPassword(email: string) {
    return this.http.post('/password-reset/email', { email });
  }

  public getUserByToken(token: string) {
    return this.http.get('/token/user', {
      params: { token }
    });
  }

  public resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.post(`/password-reset?token=${token}`, {
      password,
      confirmPassword
    });
  }

  public getCredentialToken() {
    const currentCredentials = this.currentCredentials;

    if (currentCredentials && currentCredentials.token) {
      return currentCredentials.token;
    }
  }

  private storeCredentials(data) {
    const credentials: Credential = {
      token: data.token,
      username: data.username,
      email: data.email,
      currentDate: data.currentDate,
      companyInfo: data.company,
      role: data.role
    };

    localStorage.setItem(CREDENTIAL_STORAGE, JSON.stringify(credentials));

    this.credentialSubject.next(credentials);

    return credentials;
  }
}
