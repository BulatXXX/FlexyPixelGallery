import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../core/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  constructor(private http: HttpClient) {
  }

  requestPasswordReset(email: string) {
    return this.http.post(`${environment.apiUrl}/password-recovery/request`, {email})
  }

  confirmNewPassword(token: string, newPassword: string) {
    return this.http.post(`${environment.apiUrl}/password-recovery/confirm`, {token, newPassword})
  }
}
