import { Component, Input } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';
import {AsyncPipe, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase} from '@angular/common';
import { AnimationService } from '../../service/AnimationService';
import { SettingsService } from '../../service/SettingsService';
import {Mode} from '../../models/Mode';
import {ImageAttachingService} from '../../service/ImageAttachingService';
import {SpectatorComponent} from './modes/spectator/spectator.component';
import {ImageAttachingComponent} from './modes/image-attaching/image-attaching.component';
import {DrawingComponent} from './modes/drawing/drawing.component';

@Component({
  selector: 'app-inspector',
  imports: [
    ColorPickerModule,
    NgStyle,
    NgSwitch,
    NgSwitchCase,
    SpectatorComponent,
    ImageAttachingComponent,
    DrawingComponent,
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


  protected readonly Mode = Mode;



}
