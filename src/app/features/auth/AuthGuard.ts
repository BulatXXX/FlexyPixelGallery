// src/app/features/auth/AuthGuard.ts
import { Injectable }   from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {TokenStorageService} from './services/TokenStorageService';
import {AuthService} from './services/AuthService';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const access = this.tokenStorage.getAccessToken();
    if (access) {
      return true;
    }
    const refresh = this.tokenStorage.getRefreshToken();
    if (refresh) {
      try {
        await this.authService.refreshToken();
        return true;
      } catch {
        this.tokenStorage.clearAll();
      }
    }
    await this.router.navigate(['/sign-in']);
    return false;
  }
}
