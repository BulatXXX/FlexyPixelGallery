import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<User>('http://localhost:8080/users/me');
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
