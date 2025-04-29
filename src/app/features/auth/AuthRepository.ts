import { Observable } from 'rxjs';
import {SignInResponse} from './models/SignInResponse';
import {SignUpData} from './models/SignUpData';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


export abstract class AuthRepository {
  abstract signIn(loginOrEmail: string, password: string): Observable<SignInResponse>;
  abstract signUp(data: SignUpData): Observable<void>;
}

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private http: HttpClient) {}

  signIn(loginOrEmail: string, password: string): Observable<SignInResponse> {
    return this.http.post<SignInResponse>('http://localhost:8080/users/login', {
      loginOrEmail,
      password
    });
  }

  signUp(data: SignUpData): Observable<void> {
    return this.http.post<void>('http://localhost:8080/users/register', data);
  }
}
