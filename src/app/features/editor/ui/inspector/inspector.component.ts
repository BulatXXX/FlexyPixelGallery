import { Component, Input } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';
import {AsyncPipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { AnimationService } from '../../service/AnimationService';
import { SettingsService } from '../../service/SettingsService';
import {Mode} from '../../models/Mode';
import {ImageAttachingService} from '../../service/ImageAttachingService';

@Component({
  selector: 'app-inspector',
  imports: [
    ColorPickerModule,
    NgStyle,
    MatIcon,
    NgForOf,
    NgIf,
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
    protected settingsService: SettingsService,
    private imageAttachingService: ImageAttachingService,
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

  async onFileSelected(evt: Event) {
    const file = (evt.target as HTMLInputElement).files?.[0];
    if (!file) return;
    await this.imageAttachingService.loadFile(file);
  }
  // cover: radio buttons (cover/fit)
  onCoverageChange(cov: 'cover'|'fit') {
   // this.imageAttachingService.setOptions({ coverage: cov });
  }

// target: radio buttons (current/all/selected)
  onTargetChange(t: 'current'|'all'|'selected', selectedFrames?: number[]) {
  //  this.imageAttachingService.setOptions({ target: t, selectedFrames });
  }


  async applyImage() {
    await this.imageAttachingService.apply();
  }

}
