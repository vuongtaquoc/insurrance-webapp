import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Credential } from '@app/core/models';

const CREDENTIAL_STORAGE = 'CREDENTIALS';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private credentialSubject: BehaviorSubject<Credential>;
  public credentials: Observable<Credential>;

  constructor(private http: HttpClient) {
    this.credentialSubject = new BehaviorSubject<Credential>(JSON.parse(localStorage.getItem(CREDENTIAL_STORAGE)));
    this.credentials = this.credentialSubject.asObservable();
  }

  public get currentCredentials(): Credential {
    return JSON.parse(localStorage.getItem(CREDENTIAL_STORAGE));
  }

  public login(username: string, password: string): Observable<Credential> {
    return this.http.post<any>('/authenticate', {
      username,
      password
    }).pipe(
      map(data => {
        return this.storeCredentials(data);
      })
    );
  }

  public logout() {
    this.http.post<any>('/logout', null).toPromise();

    localStorage.removeItem(CREDENTIAL_STORAGE);
    this.credentialSubject.next(null);
  }

  public requestResetPassword(email: string) {
    return this.http.post<any>('/password-reset/email', { email });
  }

  public getUserByToken(token: string) {
    return this.http.get<any>('/token/user', {
      params: { token }
    });
  }

  public resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.post<any>(`/password-reset?token=${token}`, {
      password,
      confirmPassword
    });
  }

  private storeCredentials(data) {
    const credentials: Credential = {
      token: data.accessToken,
      expiresIn: data.expiresIn,
      tokenType: data.tokenType
    };

    localStorage.setItem(CREDENTIAL_STORAGE, JSON.stringify(credentials));

    this.credentialSubject.next(credentials);

    return credentials;
  }
}
