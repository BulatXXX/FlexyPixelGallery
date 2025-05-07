import {Component, signal} from '@angular/core';
import {MatCard} from '@angular/material/card';

import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {PasswordResetService} from '../password-reset.service';

@Component({
  selector: 'app-password-recovery-screen',
  imports: [
    MatCard,
    MatInputModule,
    MatFormField,
    FormsModule,
    MatButton,
    MatInput,
    NgIf
  ],
  templateUrl: './password-recovery-screen.component.html',
  standalone: true,
  styleUrl: './password-recovery-screen.component.css'
})
export class PasswordRecoveryScreenComponent {
  email = signal<string>('');
  emailSent = signal<boolean>(false);

  constructor(private passwordResetService: PasswordResetService) {
  }
  sendResetEmail() {
    // сбрасываем предыдущий статус (если нужно)
    this.emailSent.set(false);

    this.passwordResetService.requestPasswordReset(this.email()).subscribe({
      next: () => {
        // включаем сообщение об успешной отправке
        this.emailSent.set(true);
      },
      error: (err) => {
        // тут можно показывать ошибку
        console.error('Reset failed', err);
      },
    });
  }
}
