import {Component, EventEmitter, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {EditorActions, EditorStateService} from '../../service/editor-state.service';

@Component({
  selector: 'app-menu',
  imports: [
    MatIcon
  ],
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(private editorStateService: EditorStateService) {
  }

  centerGrid() {
    this.editorStateService.triggerAction(EditorActions.CenterGrid);
  }

  turnSpectatorMode() {
    this.editorStateService.triggerAction(EditorActions.TurnSpectatorMode);
  }

  turnEditorMode() {
    this.editorStateService.triggerAction(EditorActions.TurnEditorMode);
  }
}
