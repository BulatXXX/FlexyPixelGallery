import { Component } from '@angular/core';
import {CanvasComponent} from '../ui/canvas/canvas.component';
import {InspectorComponent} from '../ui/inspector/inspector.component';
import {DimensionService, EditorComponentsDimensions} from '../service/DimensionService';
import {MenuComponent} from '../ui/menu/menu.component';
import {ToolsComponent} from '../ui/tools/tools.component';
import {PreviewComponent} from '../ui/preview/preview.component';

@Component({
  selector: 'app-editor-screen',
  imports: [
    CanvasComponent,
    MenuComponent,
    InspectorComponent,
    ToolsComponent,
    PreviewComponent,
  ],
  templateUrl: './editor-screen.component.html',
  standalone: true,
  styleUrl: './editor-screen.component.css',
})
export class EditorScreenComponent {

  constructor(protected dimensionService: DimensionService) {
  }

  dimensions: EditorComponentsDimensions = {
    menuDimensions: { width: 300, height: 30 },
    inspectorDimensions: { width: 300, height: 200 },
    canvasDimensions: { width: 300, height: 300 },
    toolsDimensions: { width: 60, height: 300 },
    previewDimensions: { width: 300, height: 300 },
  };



  ngOnInit(): void {
    this.dimensionService.dimensions$.subscribe(dims => {
      this.dimensions = dims;
    });
  }
}
