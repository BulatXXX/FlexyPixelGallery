import { Component } from '@angular/core';
import {CanvasComponent} from '../ui/canvas/canvas.component';
import {EditorStateService} from '../service/editor-state.service';
import {MenuComponent} from '../ui/menu/menu.component';
import {InspectorComponent} from '../ui/inspector/inspector.component';

@Component({
  selector: 'app-editor-screen',
  imports: [
    CanvasComponent,
    MenuComponent,
    InspectorComponent,
  ],
  templateUrl: './editor-screen.component.html',
  standalone: true,
  styleUrl: './editor-screen.component.css',
})
export class EditorScreenComponent {



  handleCenterGrid() {

  }
}
