import {Component, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {EditorStateService} from '../../service/EditorState.service';
import {AsyncPipe, NgClass, NgStyle} from '@angular/common';
import {CommandManager} from '../../service/CommandManager';
import {Mode} from '../../models/Mode';
import {EditorActions} from '../../models/EditorActions';
import {MatTooltip} from '@angular/material/tooltip';

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

  constructor(protected editorStateService: EditorStateService, private commandManager: CommandManager) {
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

  switchMode(mode:Mode){
    this.editorStateService.setMode(mode)
  }

  toggleBorders() {
    this.editorStateService.toggleBorders();
  }

  toggleDirections() {
    this.editorStateService.toggleDirections();
  }

  protected readonly Mode = Mode;


}
