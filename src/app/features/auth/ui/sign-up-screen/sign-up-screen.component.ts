import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {NgStyle} from '@angular/common';
import {AuthService} from '../../services/AuthService';
import {SignUpData} from '../../models/SignUpData';
import {NotificationService} from '../../../../core/services/NotificationService';
import {Router} from '@angular/router';
import {LoadingService} from '../../../../core/services/LoadingService';

@Component({
  selector: 'app-sign-up-screen',
  imports: [
    FormsModule,
    MatCardModule,
    MatInput,
    MatIconButton,
    MatButton,
    MatFormField,
    MatIcon,
    MatLabel,
  ],
  templateUrl: './sign-up-screen.component.html',
  standalone: true,
  styleUrl: './sign-up-screen.component.css',
})
export class SignUpScreenComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  login: string = '';
  isPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  phoneNumber: string = '';

  validatePhoneNumber(event: KeyboardEvent) {
    const char = event.key;


    if (!/^[0-9]$/.test(char) && !['Backspace', 'ArrowLeft', 'ArrowRight'].includes(char)) {
      event.preventDefault();
    }
  }

  constructor(private authService: AuthService, private notificationService: NotificationService,
              private loadingService: LoadingService, private router: Router) {

  }

  formatPhoneNumber() {
    let cleaned = this.phoneNumber.replace(/\D/g, ''); // Удаляем все нечисловые символы


    if (!(cleaned.startsWith('7') || cleaned.startsWith('8'))) {
      cleaned = '7' + cleaned;
    }

    cleaned = cleaned.slice(0, 11);

    let formatted = '+7 ';

    if (cleaned.length > 1) formatted += `(${cleaned.slice(1, 4)}`;
    if (cleaned.length > 3) formatted += `) ${cleaned.slice(4, 7)}`;
    if (cleaned.length > 6) formatted += `-${cleaned.slice(7, 9)}`;
    if (cleaned.length > 8) formatted += `-${cleaned.slice(9, 11)}`;

    this.phoneNumber = formatted;
  }

  async signUp() {
    this.loadingService.show();
    try {
      const data: SignUpData = {
        displayName: this.username,
        login: this.login,
        email: this.email,
        phone: this.phoneNumber,
        password: this.password
      };
      await this.authService.signUp(data);
      this.notificationService.showSuccess('Registration successful!');
      await this.router.navigate(['/sign-in']);
    } catch (err) {
      this.notificationService.showError('Registration failed');
      console.error('SignUp error:', err);
    } finally {
      this.loadingService.hide();
    }
  }

  private validateInputs() {
    //TODO validation options
  }

  protected readonly window = window;
}
