import {Component, OnInit} from '@angular/core';
import {CanvasComponent} from '../ui/canvas/canvas.component';
import {InspectorComponent} from '../ui/inspector/inspector.component';
import {DimensionService, EditorComponentsDimensions} from '../service/DimensionService';
import {MenuComponent} from '../ui/menu/menu.component';
import {ToolsComponent} from '../ui/tools/tools.component';
import {PreviewComponent} from '../ui/preview/preview.component';
import {ConfigurationService} from '../service/ConfigurationService';
import {ActivatedRoute} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {LoadingService} from '../../../core/services/LoadingService';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-editor-screen',
  imports: [
    CanvasComponent,
    MenuComponent,
    InspectorComponent,
    ToolsComponent,
    PreviewComponent,
    NgStyle,
  ],
  templateUrl: './editor-screen.component.html',
  standalone: true,
  styleUrl: './editor-screen.component.css',
})
export class EditorScreenComponent implements OnInit {

  constructor(protected dimensionService: DimensionService,
              private configurationService: ConfigurationService,
              private route: ActivatedRoute,
              private loadingService: LoadingService) {
  }

  dimensions: EditorComponentsDimensions = {
    menuDimensions: { width: 300, height: 30 },
    inspectorDimensions: { width: 300, height: 200 },
    canvasDimensions: { width: 300, height: 300 },
    toolsDimensions: { width: 60, height: 300 },
    previewDimensions: { width: 300, height: 300 },
  };


  async loadById(publicId: string): Promise<void> {
    try {
      const config = await firstValueFrom(
        this.configurationService.loadConfiguration(publicId)
      );
      this.configurationService.applyConfiguration(config);
      console.log('Configuration loaded successfully:', config);
    } catch (err) {
      console.error('Error loading configuration:', err);
    }
  }

  ngOnInit(): void {
    const publicId = this.route.snapshot.paramMap.get('publicId');
    if (publicId) {
      void this.loadById(publicId);
    }
    this.dimensionService.dimensions$.subscribe(dims => {
      this.dimensions = dims;
    });
  }
}
