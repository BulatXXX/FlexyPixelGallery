import { Component } from '@angular/core';
import {CanvasComponent} from '../ui/canvas/canvas.component';
import {InspectorComponent} from '../ui/inspector/inspector.component';

@Component({
  selector: 'app-editor-screen',
  imports: [
    CanvasComponent,
    InspectorComponent,
  ],
  templateUrl: './editor-screen.component.html',
  standalone: true,
  styleUrl: './editor-screen.component.css',
})
export class EditorScreenComponent {
}
