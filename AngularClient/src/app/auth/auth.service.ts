import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { Signin } from './login.model';
import { catchError, map } from 'rxjs/operators';
import { handleError } from '../shared/errorhandler';
import { Observable, Subject } from 'rxjs';
import { TokenResponse } from './token-response.model';
import { Signup } from './signup/signup.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  notifyLoggedIn$ = new Subject();

  constructor(
    private storageService: StorageService,
    private http: HttpClient
  ) {}

  public notifyLoggedIn(): void {
    this.notifyLoggedIn$.next();
  }

  public getToken(): string {
    return this.storageService.fetchToken();
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getUserId(): string {
    return this.storageService.fetch('userId');
  }

  public signin(signinData: Signin): Observable<TokenResponse> {
    return this.http
      .post<Signin>('/api/account/signin', signinData, {
        observe: 'body'
      })
      .pipe<TokenResponse>(catchError(handleError));
  }

  public signUp(signupData: Signup): Observable<any> {
    return this.http
      .post<Signin>('/api/account/signup', signupData, {
        observe: 'body'
      })
      .pipe<TokenResponse>(catchError(handleError));
  }

  public logout(): Observable<boolean> {
    return this.http
      .get(`/api/Account/Logout`)
      .pipe(
        map(response => {
          this.storageService.deleteToken();
          this.storageService.delete('userId');
          return true;
        }),
        catchError(handleError));
  }
}
