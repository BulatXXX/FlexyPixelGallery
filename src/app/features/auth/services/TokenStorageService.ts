// src/app/core/services/token-storage.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly ACCESS_TOKEN_KEY  = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USERNAME_KEY      = 'username';

  // — ACCESS TOKEN
  saveAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  clearAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  // — REFRESH TOKEN
  saveRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  clearRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // — USERNAME (или ID)
  saveUsername(username: string): void {
    localStorage.setItem(this.USERNAME_KEY, username);
  }
  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }
  clearUsername(): void {
    localStorage.removeItem(this.USERNAME_KEY);
  }

  // — всё сразу очистить
  clearAll(): void {
    this.clearAccessToken();
    this.clearRefreshToken();
    this.clearUsername();
  }
}
