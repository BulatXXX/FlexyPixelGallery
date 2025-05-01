import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { environment } from '../../core/environment';

@Injectable({ providedIn: 'root' })
export class UserRepository {
  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/me`);
  }
  getUserById(publicId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/${publicId}`);
  }

  getPublicConfigurationsByUser(publicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/${publicId}/configurations/public`);
  }


  getAllConfigurations(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/configurations/my/all`);
  }

  getOriginalConfigurations(): Observable<any[]> {
    // Заглушка — в будущем заменишь на /configurations/my/original
    return this.http.get<any[]>(`${environment.apiUrl}/configurations/my/all?forkStatus=ORIGINAL`);
  }

  getForkedConfigurations(): Observable<any[]> {
    // Заглушка — в будущем заменишь на /configurations/my/forked
    return this.http.get<any[]>(`${environment.apiUrl}/configurations/my/all?forkStatus=FORKED`);
  }

  getPublicConfigurations(): Observable<any[]> {
    // Заглушка — в будущем заменишь на /configurations/my/public
    return this.http.get<any[]>(`${environment.apiUrl}/configurations/my/all?isPublic=true`);
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

}
