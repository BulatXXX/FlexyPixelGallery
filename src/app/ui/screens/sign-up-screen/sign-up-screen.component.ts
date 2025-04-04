import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';

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
    MatLabel
  ],
  templateUrl: './sign-up-screen.component.html',
  standalone: true,
  styleUrl: './sign-up-screen.component.css'
})
export class SignUpScreenComponent {
  username: string = '';
  password: string = '';
  email: string = '';
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
    //TODO sign up logic
  }

  private validateInputs() {
    //TODO validation options
  }
}
