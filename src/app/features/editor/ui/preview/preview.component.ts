import {Component, Input} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {AnimationService} from '../../service/AnimationService';
import {Frame} from '../../models/Frame';
import {MatIcon} from '@angular/material/icon';
import {PanelStateService} from '../../service/PanelStateService';
import {Panel} from '../../models/Panel';

@Component({
  selector: 'app-preview',
  standalone: true,
  templateUrl: './preview.component.html',
  imports: [
    NgStyle,
    NgClass,
    MatIcon,
    NgForOf,
    NgIf
  ],
  styleUrl: './preview.component.css'
})
export class PreviewComponent {
  @Input() width: number = 100;
  @Input() height: number = 100;
  frames: Frame[] = [];
  currentFrameIndex: number = 0;
  panels: Panel[] = [];

  previewListItemWidth = 100;
  previewListItemHeight = 100;

  panelPreviewSize: number = 5;

  offsetX: number = 0;
  offsetY: number = 0;

  constructor(protected animationService: AnimationService, protected panelStateService: PanelStateService) {

  }


  ngOnInit() {
    this.animationService.frames$.subscribe(frames => {
      this.frames = frames;
    })
    this.animationService.currentFrameIndex$.subscribe(currentFrameIndex => {
      this.currentFrameIndex = currentFrameIndex;
    })

    this.panelStateService.panels$.subscribe(panels => {
      for(let i = 0; i < panels.length; i++) {
        console.log(panels[i].x,panels[i].y);
      }
      this.panels = panels;
      this.computePanelPreviewDimensions();
    });
  }
  computePanelPreviewDimensions(): void {
    if (!this.panels.length) {
      this.panelPreviewSize = 0;

      this.offsetX = 0;
      this.offsetY = 0;
      return;
    }
    const PANEL_SIZE = 8; // размер панели в клетках

    // Вычисляем минимальные и максимальные координаты (предполагаем, что panel.x и panel.y кратны PANEL_SIZE)
    const minX = Math.min(...this.panels.map(p => p.x));
    const minY = Math.min(...this.panels.map(p => p.y));
    const maxX = Math.max(...this.panels.map(p => p.x));
    const maxY = Math.max(...this.panels.map(p => p.y));

    // Количество панелей по горизонтали и вертикали
    const totalColumns = ((maxX - minX) / PANEL_SIZE)+1;
    const totalRows = ((maxY - minY) / PANEL_SIZE)+1;

    // Берем максимум, чтобы панели были квадратными и умещались в превью
    const maxPanelsFromOneSide = Math.max(totalColumns, totalRows);

    // Вычисляем размер одной миниатюрной панели
    this.panelPreviewSize = this.previewListItemHeight / maxPanelsFromOneSide;


    // Вычисляем смещения (offset) для центрирования: если панели начинаются не с 0,0, смещаем всю конфигурацию
    this.offsetX = (minX / PANEL_SIZE) * this.panelPreviewSize;
    this.offsetY = (minY / PANEL_SIZE) * this.panelPreviewSize;
  }


  selectFrame(index: number): void {
    this.animationService.selectFrame(index);
  }

  addFrame(): void {
    this.animationService.selectFrame(this.currentFrameIndex+1);
  }

  getPanelIds(frame: Frame): string[] {
    return Object.keys(frame.panelPixelColors);
  }
  getPanelMatrix(frame: Frame, panelId: string): string[][] {
    return frame.panelPixelColors[panelId] || [];
  }




  getPanelTransform(panel: Panel): string {
    const x = (panel.x/8 * this.panelPreviewSize) - this.offsetX;
    const y = (panel.y/8 * this.panelPreviewSize) - this.offsetY;
    return `translate(${x}, ${y})`;
  }

}
