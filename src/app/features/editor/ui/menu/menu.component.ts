import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {EditorActions, EditorStateService, Mode} from '../../service/editor-state.service';
import {NgStyle} from '@angular/common';

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

  constructor(private editorStateService: EditorStateService) {
  }

  centerGrid() {
    this.editorStateService.triggerAction(EditorActions.CenterGrid);
  }

  turnSpectatorMode() {
    this.editorStateService.setMode(Mode.SpectatorMode);
  }

  turnEditorMode() {
    this.editorStateService.setMode(Mode.EditorMode);
  }
}
