import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {ConfigurationInputDialogComponent} from '../ui/components/dialog/dialog/dialog.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * Открывает диалог для ввода publicId конфигурации.
   * Возвращает Observable, в котором придет строка (ID) или null, если отменено.
   */
  openConfigurationDialog(): Observable<string> {
    const dialogRef = this.dialog.open(ConfigurationInputDialogComponent, {
      width: '400px',
      data: {} // можно передать начальные данные, если требуется
    });
    return dialogRef.afterClosed();
  }
}
