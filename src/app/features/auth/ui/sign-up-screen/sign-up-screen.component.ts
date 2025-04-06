import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {NgStyle} from '@angular/common';
import {AuthService} from '../../services/AuthService';
import {SignUpData} from '../../models/SignUpData';
import {NotificationService} from '../../../../services/NotificationService';
import {Router} from '@angular/router';
import {AuthRepository, AuthRepositoryImpl} from '../../AuthRepository';

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
    NgStyle
  ],
  templateUrl: './sign-up-screen.component.html',
  standalone: true,
  styleUrl: './sign-up-screen.component.css',
})
export class SignUpScreenComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  login:string = '';
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
  constructor(private authService: AuthService,private notificationService: NotificationService,) {

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

  signUp(){
    this.validateInputs()
    const data: SignUpData = {
      email: this.email,
      login: this.login,
      displayName: this.username,
      password: this.password,
      phone: this.phoneNumber,
    }
    this.authService.signUp(data).subscribe((success)=>{
      if (success) {
        this.notificationService.showSuccess('Регистрация успешна!');
      } else {
        this.notificationService.showError('Ошибка при регистрации');
      }
    });
  }

  private validateInputs() {
    //TODO validation options
  }

  protected readonly window = window;
}
