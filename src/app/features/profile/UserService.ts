import {Injectable} from '@angular/core';

import {environment} from '../../app.config';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me`);
  }

}

export interface User {
  publicId: string
  email: string
  username: string
  displayName: string
  phone: string
  avatarUrl: any
  bio: any
  isVerified: boolean
  role: string
  mobileRole: string
  createdAt: string
}
