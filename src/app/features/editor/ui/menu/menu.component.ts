import {Component, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {PanelStateService} from '../../service/PanelStateService';
import {AsyncPipe, NgClass, NgStyle} from '@angular/common';
import {CommandManager} from '../../service/CommandManager';
import {Mode} from '../../models/Mode';
import {EditorActions} from '../../models/EditorActions';
import {MatTooltip} from '@angular/material/tooltip';
import {SettingsService} from '../../service/SettingsService';

@Component({
  selector: 'app-menu',
  imports: [
    MatIcon,
    NgStyle,
    MatTooltip,
    AsyncPipe,
    NgClass
  ],
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Input() width: number = 0;
  @Input() height: number = 0;

  constructor(protected editorStateService: PanelStateService, private commandManager: CommandManager,protected settingsService: SettingsService) {
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
