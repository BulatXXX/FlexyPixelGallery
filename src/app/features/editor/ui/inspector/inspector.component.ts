import { Component, Input } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { AnimationService } from '../../service/AnimationService';
import { SettingsService } from '../../service/SettingsService';
import {Mode} from '../../models/Mode';

@Component({
  selector: 'app-inspector',
  imports: [
    ColorPickerModule,
    NgStyle,
    MatIcon,
    NgForOf,
    NgIf
  ],
  templateUrl: './inspector.component.html',
  standalone: true,
  styleUrls: ['./inspector.component.css']
})
export class InspectorComponent {

  @Input() height: number = 0;
  @Input() width: number = 0;
  frameIndex = 0;

  // Предопределённая палитра цветов
  paletteColors: string[] = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  // Делаем enum Mode доступным в шаблоне
  mode = Mode;

  constructor(
    protected animationService: AnimationService,
    protected settingsService: SettingsService
  ) {
    this.animationService.currentFrameIndex$.subscribe(frameIndex => {
      this.frameIndex = frameIndex;
    });

  }

  prevFrame() {
    this.animationService.selectFrame(this.frameIndex - 1);
  }

  nextFrame() {
    this.animationService.selectFrame(this.frameIndex + 1);
  }

  playAnimation() {
    this.animationService.playAnimation();
  }

  // Метод для выбора цвета из палитры
  selectColor(color: string): void {
    this.settingsService.setting.drawingColor = color;
  }



  protected readonly Mode = Mode;
}
