import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}
