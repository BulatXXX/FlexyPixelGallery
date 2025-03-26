import { Component, Input} from '@angular/core';
import {ColorPickerModule} from 'ngx-color-picker';
import {PanelStateService} from '../../service/PanelStateService';
import {NgStyle} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {AnimationService} from '../../service/AnimationService';

@Component({
  selector: 'app-inspector',
  imports: [
    ColorPickerModule,
    NgStyle,
    MatIcon
  ],
  templateUrl: './inspector.component.html',
  standalone: true,
  styleUrl: './inspector.component.css'
})
export class InspectorComponent {

  @Input() height: number = 0;
  @Input() width: number = 0;
  counter = 0;

  constructor(protected editorStateService: PanelStateService, protected animationService: AnimationService,) {

  }

  prevFrame(){
    this.animationService.selectFrame(this.counter-1)
    this.counter=this.counter-1;
  }
  nextFrame(){
    this.animationService.selectFrame(this.counter+1)
    this.counter=this.counter+1;
  }


  playAnimation() {
    this.animationService.playAnimation()
  }
}
