import {Component, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {EditorStateService} from '../../service/editor-state.service';
import {NgStyle} from '@angular/common';
import {CommandManager} from '../../service/CommandManager';
import {Mode} from '../../models/Mode';
import {EditorActions} from '../../models/EditorActions';

@Component({
  selector: 'app-menu',
  imports: [
    MatIcon,
    NgStyle
  ],
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Input() width: number = 0;

  constructor(private editorStateService: EditorStateService,private commandManager: CommandManager) {
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

  turnSpectatorMode() {
    this.editorStateService.setMode(Mode.SpectatorMode)
  }

  turnEditorMode() {
    this.editorStateService.setMode(Mode.EditorMode)
  }
}
