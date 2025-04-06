// token-storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'token';
  private readonly USERNAME_KEY = 'username';

  saveToken(token: string): void {
    console.log("save: ",token);
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log("get: ",token);
    return token;
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  saveUsername(username: string): void {
    localStorage.setItem(this.USERNAME_KEY, username);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  clearUsername(): void {
    localStorage.removeItem(this.USERNAME_KEY);
  }
}
