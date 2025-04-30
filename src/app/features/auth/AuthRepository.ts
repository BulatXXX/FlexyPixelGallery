import {Observable} from 'rxjs';
import {SignInResponse} from './models/SignInResponse';
import {SignUpData} from './models/SignUpData';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../core/environment';

export abstract class AuthRepository {
  abstract signIn(loginOrEmail: string, password: string): Observable<SignInResponse>;
  abstract signUp(data: SignUpData): Observable<void>;
  abstract refresh(refreshToken: string): Observable<SignInResponse>;
}

@Injectable({ providedIn: 'root' })
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private http: HttpClient) {}

  signIn(loginOrEmail: string, password: string) {
    return this.http.post<SignInResponse>(`${environment.apiUrl}/auth/login`, { loginOrEmail, password });
  }

  signUp(data: SignUpData) {
    return this.http.post<void>(`${environment.apiUrl}/auth/register`, data);
  }

  refresh(refreshToken: string) {
    return this.http.post<SignInResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken });
  }
}
