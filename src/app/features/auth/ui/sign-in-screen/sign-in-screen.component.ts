import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/AuthService';
import {LoadingService} from '../../../../core/services/LoadingService';
import {NotificationService} from '../../../../core/services/NotificationService';

import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';

import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';



@Component({
  selector: 'app-sign-in-screen',
  templateUrl: './sign-in-screen.component.html',
  standalone: true,
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    MatIcon,
    MatIconButton,
    RouterLink,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  styleUrls: ['./sign-in-screen.component.css']
})
export class SignInScreenComponent {
  username = '';
  password = '';
  isPasswordVisible = false;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async login() {
    this.loadingService.show();
    try {
      await this.authService.signIn(this.username, this.password);
      this.notificationService.showSuccess('Login successful!');

      await this.router.navigate(['/profile']);
    } catch (err) {
      await new Promise(res => setTimeout(res, 2000));

      this.notificationService.showError('Invalid username or password');
      console.error('SignIn error:', err);
    } finally {
      this.loadingService.hide();
    }
  }
}
