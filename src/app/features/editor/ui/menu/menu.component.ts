import {Component, Input, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {PanelStateService} from '../../service/PanelStateService';
import {AsyncPipe, NgClass, NgStyle} from '@angular/common';
import {CommandManager} from '../../service/CommandManager';
import {Mode} from '../../models/Mode';
import {EditorActions} from '../../models/EditorActions';
import {MatTooltip} from '@angular/material/tooltip';
import {SettingsService} from '../../service/SettingsService';
import {FormsModule} from '@angular/forms';
import {AnimationService} from '../../service/AnimationService';

@Component({
  selector: 'app-menu',
  imports: [
    MatIcon,
    NgStyle,
    MatTooltip,
    AsyncPipe,
    NgClass,
    FormsModule
  ],
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  @Input() width: number = 0;
  @Input() height: number = 0;

  currentFrameNumber = 0;

  ngOnInit() {
    this.animationService.currentFrameIndex$.subscribe((index) => {
      this.currentFrameNumber = index;
    });
  }
  onFrameNumberChange(event: any) {
    let val = parseInt(event.target.value, 10);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val > 585) val = 585;
    this.currentFrameNumber = val;
    this.animationService.selectFrame(val);
  }

  prevFrame() {
    const newIndex = Math.max(0, this.currentFrameNumber - 1);
    this.animationService.selectFrame(newIndex);
  }
  nextFrame() {
    const newIndex = Math.min(585, this.currentFrameNumber + 1);
    this.animationService.selectFrame(newIndex);
  }
  constructor(protected editorStateService: PanelStateService, private commandManager: CommandManager,protected settingsService: SettingsService,protected animationService: AnimationService) {
  }

  undo(){
    this.commandManager.undo()
  }
  redo(){
    this.commandManager.redo()
  }

  centerGrid() {
    this.editorStateService.triggerAction(EditorActions.CenterGrid);
  }



  toggleBorders() {
    this.settingsService.toggleBorders();
  }

  toggleDirections() {
    this.settingsService.toggleDirections();
  }

  protected readonly Mode = Mode;


  zoomIn() {
    this.editorStateService.triggerAction(EditorActions.ZoomIn)
  }
  zoomOut() {
    this.editorStateService.triggerAction(EditorActions.ZoomOut);
  }
}
