import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
export class PreviewComponent implements OnChanges , OnInit,AfterViewChecked {
  @Input() width: number = 100;
  @Input() height: number = 100;
  frames: Frame[] = [];
  currentFrameIndex: number = 0;
  panels: Panel[] = [];

  previewListItemSize = 10;

  panelPreviewSize: number = 5;

  offsetX: number = 0;
  offsetY: number = 0;

  usedWidth: number = 0;
  usedHeight: number = 0;


  constructor(protected animationService: AnimationService, protected panelStateService: PanelStateService) {

  }

  ngAfterViewChecked(): void {
        throw new Error('Method not implemented.');
    }

  ngOnChanges(changes: SimpleChanges): void {
     this.updateSizes()
  }


  ngOnInit() {
    this.updateSizes()
    this.animationService.frames$.subscribe(frames => {
      this.frames = frames;
    })
    this.animationService.currentFrameIndex$.subscribe(currentFrameIndex => {
      this.currentFrameIndex = currentFrameIndex;
    })

    this.panelStateService.panels$.subscribe(panels => {
      this.panels = panels;
      this.computePanelPreviewDimensions();
    });
  }

  private updateSizes() {
    this.previewListItemSize = this.height * 0.65
    this.computePanelPreviewDimensions()
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

    this.panelPreviewSize = this.previewListItemSize / maxPanelsFromOneSide;

    this.usedWidth = totalColumns * this.panelPreviewSize;
    this.usedHeight = totalRows * this.panelPreviewSize;

    this.offsetX = (minX / PANEL_SIZE) * this.panelPreviewSize;
    this.offsetY = (minY / PANEL_SIZE) * this.panelPreviewSize;
    console.log(this.offsetX,this.offsetY)

  }


  selectFrame(index: number): void {
    this.animationService.selectFrame(index);
  }

  addFrame(): void {
    this.animationService.selectFrame(this.animationService.frames.length);
  }

  getPanelMatrix(frame: Frame, panelId: string): string[][] {
    return frame.panelPixelColors[panelId] || [];
  }




  getPanelTransform(panel: Panel): string {
    let x = (panel.x/8 * this.panelPreviewSize) - this.offsetX;
    let y = (panel.y/8 * this.panelPreviewSize) - this.offsetY;
    if(this.usedWidth>this.usedHeight){
      y += (this.previewListItemSize - this.usedHeight) / 2;
    }
    else if(this.usedHeight>this.usedWidth) {
      x += (this.previewListItemSize - this.usedWidth) / 2;
    }
    return `translate(${x}, ${y})`;

  }

}
