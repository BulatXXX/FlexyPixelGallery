import { Injectable } from '@angular/core';

import { SignUpData } from '../models/SignUpData';

import {BehaviorSubject, Observable, catchError, finalize, of, tap, map} from 'rxjs';
import {AuthRepository} from '../AuthRepository';
import {SignInResponse} from '../models/SignInResponse';
import {TokenStorageService} from './TokenStorageService';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private authRepo: AuthRepository, private tokenStorage: TokenStorageService) {}

  signIn(loginOrEmail: string, password: string): Observable<SignInResponse | null> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.authRepo.signIn(loginOrEmail, password).pipe(
      tap((res) => {
        if (res) {
          // Сохраняем токен и имя пользователя через TokenStorageService
          this.tokenStorage.saveToken(res.token);
          this.tokenStorage.saveUsername(res.username);
        }
      }),
      catchError(() => {
        this.errorSubject.next('Неверный логин или пароль');
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  signUp(data: SignUpData): Observable<boolean> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.authRepo.signUp(data).pipe(
      tap(() => {
        console.log('Регистрация успешна:', data);
      }),
      map(() => true), // <-- тут мы явно возвращаем true
      catchError(() => {
        this.errorSubject.next('Ошибка при регистрации');
        return of(false);
      }),
      finalize(() => this.loadingSubject.next(false)),
    );
  }

}
