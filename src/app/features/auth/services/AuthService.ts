import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, firstValueFrom} from 'rxjs';

import {SignUpData} from '../models/SignUpData';
import {AuthRepository} from '../AuthRepository';
import {TokenStorageService} from './TokenStorageService';



interface JwtPayload {
  publicId:   string;
  userId:     number;
  userRole:   'USER' | 'ADMIN';
  exp:        number;
  iat:        number;
  iss:        string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  private roleSubject = new BehaviorSubject<'USER'|'ADMIN'|null>(null);
  role$ = this.roleSubject.asObservable();

  constructor(
    private authRepo: AuthRepository,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    this.hydrateFromToken();
  }
  private decodeJwt<T>(token: string): T {
    const payload = token.split('.')[1];
    return JSON.parse(window.atob(payload));
  }

  private hydrateFromToken() {
    const token = this.tokenStorage.getAccessToken();
    if (!token) {
      this.roleSubject.next(null);
      return;
    }
    try {
      const { userRole } = this.decodeJwt<JwtPayload>(token);
      this.roleSubject.next(userRole);
    } catch {
      this.roleSubject.next(null);
    }
  }

  /** Логин: сохраняем access + refresh + username, затем редирект */
  async signIn(loginOrEmail: string, password: string): Promise<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    try {
      const res = await firstValueFrom(
        this.authRepo.signIn(loginOrEmail, password)
      );

      // сохраняем оба токена
      this.tokenStorage.saveAccessToken(res.accessToken);
      this.tokenStorage.saveRefreshToken(res.refreshToken);
      this.tokenStorage.savePublicId(res.publicId);

      this.hydrateFromToken()
      await this.router.navigate(['/profile']);
    } catch (err) {
      this.errorSubject.next('Неверный логин или пароль');
      return Promise.reject(err);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /** Регистрация */
  async signUp(data: SignUpData): Promise<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    try {
      await firstValueFrom(this.authRepo.signUp(data));
      // здесь можно сразу делать signIn или показывать уведомление
    } catch (err) {
      this.errorSubject.next('Ошибка при регистрации');
      return Promise.reject(err);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async refreshToken(): Promise<void> {
    const rt = this.tokenStorage.getRefreshToken();
    if (!rt) {
      return Promise.reject(new Error('Нет refresh-токена'));
    }

    this.loadingSubject.next(true);
    try {
      const res = await firstValueFrom(this.authRepo.refresh(rt));
      this.tokenStorage.saveAccessToken(res.accessToken);
      this.tokenStorage.saveRefreshToken(res.refreshToken);
    } catch (err) {
      await this.logout(); // если не удалось обновить — выкидываем пользователя
      return Promise.reject(err);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /** Выход — очищаем всё */
  async logout() {
    this.tokenStorage.clearAll();
    await this.router.navigate(['/sign-in']);
  }
}
