import {Component, Input} from '@angular/core';
import {ColorPickerModule} from 'ngx-color-picker';
import {NgStyle, NgSwitch, NgSwitchCase} from '@angular/common';
import {SettingsService} from '../../service/SettingsService';
import {Mode} from '../../models/Mode';
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
  mode = Mode;

  constructor(protected settingsService: SettingsService,) {
  }

  protected readonly Mode = Mode;
}
