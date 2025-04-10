import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';

import {Router, RouterLink} from '@angular/router';
import {LoadingService} from '../../../../services/LoadingService';
import {NotificationService} from '../../../../services/NotificationService';
import {AuthService} from '../../services/AuthService';

@Component({
  selector: 'app-sign-in-screen',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInput,
    MatIconButton,
    MatButton,
    RouterLink,
  ],
  templateUrl: './sign-in-screen.component.html',
  standalone: true,
  styleUrl: './sign-in-screen.component.css'
})
export class SignInScreenComponent {
  username: string = '';
  password: string = '';
  isPasswordVisible: boolean = false;

  constructor(private authService: AuthService,
              private loadingService: LoadingService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  login() {
    this.loadingService.show();
    this.authService.signIn(this.username, this.password).subscribe(
      (response) => {
        this.loadingService.hide();
        if (response) {
          this.notificationService.showSuccess('Login successful!');
          // Переходим на профиль, где будет использован токен для получения данных
          this.router.navigate(['/profile']);
        }
      },
      (error) => {
        setTimeout(() => {
          this.notificationService.showError('Invalid username or password');
          this.loadingService.hide();
          console.error('Ошибка при авторизации:', error);
        }, 2000);
      }
    );
  }

}
