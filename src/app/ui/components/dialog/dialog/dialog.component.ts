import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
  MatDialogTitle
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-configuration-input-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle
  ],
  template: `
    <h2 mat-dialog-title>Load Configuration</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Configuration Public ID</mat-label>
        <input matInput [(ngModel)]="publicId" placeholder="Enter configuration ID" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onLoad()">Load</button>
    </mat-dialog-actions>
  `
})
export class ConfigurationInputDialogComponent {
  publicId: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConfigurationInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onLoad(): void {
    // Можно добавить валидацию, если нужно
    this.dialogRef.close(this.publicId);
  }
}
