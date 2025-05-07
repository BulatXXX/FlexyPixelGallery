import {Component, input} from '@angular/core';
import {NgForOf, NgStyle} from '@angular/common';
import {ColorPickerModule} from 'ngx-color-picker';
import {SettingsService} from '../../../../service/SettingsService';
import {MatIconModule} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {DrawingService} from '../../../../service/DrawingService';
import {PanelStateService} from '../../../../service/PanelStateService';
import {AnimationService} from '../../../../service/AnimationService';
import {PaletteGenerator} from './PaletteGenerator';

@Component({
  selector: 'app-drawing',
  imports: [
    NgForOf,
    ColorPickerModule,
    MatIconModule,
    MatIconButton,
    MatButton,
  ],
  templateUrl: './drawing.component.html',
  standalone: true,
  styleUrl: './drawing.component.css'
})
export class DrawingComponent {


  constructor(protected settingsService: SettingsService, protected paletteGenerator: PaletteGenerator) {
  }

  onColorChange(newColor: string) {
    this.settingsService.setting.drawingColor = newColor;

    // если он был выбран из палитры — перезаписываем палитру
    if (this.settingsService.setting.selectedColorIndex !== null) {
      this.settingsService.setting.paletteColors[this.settingsService.setting.selectedColorIndex] = newColor;
    }
  }

  selectColor(color: string, idx: number): void {
    this.settingsService.setting.selectedColorIndex = idx;
    this.settingsService.setting.drawingColor = color;
  }

  generatePalette(){
    this.paletteGenerator.generatePalette();
  }


  protected readonly input = input;
}
