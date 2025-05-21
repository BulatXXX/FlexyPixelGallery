import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../core/environment';

@Injectable({providedIn: 'root'})
export class UserRepository {
  constructor(private http: HttpClient) {
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/me`);
  }

  getUserById(publicId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/${publicId}`);
  }

  getPublicConfigurationsByUser(publicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/${publicId}/configurations/public`);
  }

  // user.repository.ts
  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http
      .patch<{ avatarUrl: string }>(
        `${environment.apiUrl}/users/me/avatar`,
        fd
      );
  }

  updateUserInfo(displayName: string, bio: string) {
    return this.http.patch<{ displayName: string, bio: string }>(
      `${environment.apiUrl}/users/me`,
      {displayName: displayName, bio: bio}
    )
  }
}
