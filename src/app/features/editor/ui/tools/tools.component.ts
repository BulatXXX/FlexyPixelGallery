import {Component, Input} from '@angular/core';
import {AsyncPipe, NgClass, NgStyle} from '@angular/common';
import {SettingsService} from '../../service/SettingsService';
import {Mode} from '../../models/Mode';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  standalone: true,
  imports: [
    NgStyle,
    AsyncPipe,
    MatIcon,
    MatTooltip,
    NgClass
  ],
  styleUrl: './tools.component.css'
})
export class ToolsComponent {
  @Input() width: number = 0;
  @Input() height: number = 0;
  constructor(protected settingsService: SettingsService) {
  }

  switchMode(mode:Mode){
    this.settingsService.setMode(mode)
  }
  protected readonly Mode = Mode;
}
