import {Component, HostListener, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {EditorActions, EditorStateService, Mode} from '../../service/editor-state.service';
import {Subscription} from 'rxjs';
import {Panel} from '../../models/Panel';
import {MenuComponent} from '../menu/menu.component';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [NgForOf, NgIf, MenuComponent],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  panels: Panel[] = [];

  mode: Mode = Mode.EditorMode;
  scale: number = 1;

  // Фиксированный размер ячейки
  cellSize: number = 20;

  virtualGridWidth: number = 200;
  virtualGridHeight: number = 200;

  //
  gridWidth: number = 0;
  gridHeight: number = 0;


  // Вычисляем реальные размеры канваса
  canvasWidth: number = this.gridWidth * this.cellSize;
  canvasHeight: number = this.gridHeight * this.cellSize;

  // Свойства tooltip
  tooltipText: string = '';
  tooltipX: number = 0;
  tooltipY: number = 0;
  tooltipVisible: boolean = false;

  panOffsetX: number = 0;
  panOffsetY: number = 0;

  private actionSubscription!: Subscription;
  private panelsSubscription!: Subscription;
  private modeSubscription!: Subscription;

  ngOnInit() {
    this.calculateGridDimensions();
    this.centerGrid();

    this.panelsSubscription = this.editorService.panels$.subscribe(panels => {
      this.panels = panels;
    });
    this.modeSubscription = this.editorService.mode$.subscribe(mode => {
      this.mode = mode;
    });
    this.actionSubscription = this.editorService.action$.subscribe(action => {
      switch (action) {
        case EditorActions.CenterGrid : {
          this.centerGrid();
          break;
        }
        case EditorActions.TurnSpectatorMode : {
          this.mode = Mode.SpectatorMode;
          break;
        }
        case EditorActions.TurnEditorMode : {
          this.mode = Mode.EditorMode;
          break;
        }
      }

    });
  }

  // При изменении размера окна пересчитываем размеры сетки
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateGridDimensions();
  }

  constructor(private editorService: EditorStateService) {
  }

// Обработчик события wheel для панорамирования
  onWheel(event: WheelEvent) {
    event.preventDefault();
    const svgElement = event.currentTarget as SVGSVGElement;
    const rect = svgElement.getBoundingClientRect();

    if (event.ctrlKey) {
      // Масштабирование (Zoom)
      const zoomFactor = 1.05;
      let newScale = event.deltaY < 0 ? this.scale * zoomFactor : this.scale / zoomFactor;

      // Ограничение масштаба от 0.5 до 3
      newScale = Math.max(0.5, Math.min(newScale, 3));

      // Позиция указателя относительно SVG
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;

      // Корректировка смещения, чтобы указатель оставался на том же месте
      this.panOffsetX = pointerX - (newScale / this.scale) * (pointerX - this.panOffsetX);
      this.panOffsetY = pointerY - (newScale / this.scale) * (pointerY - this.panOffsetY);

      this.scale = newScale;
      this.constrainPan(); // пересчитываем границы пейна
    } else {
      // Паникуем (Panning)
      let newPanOffsetX = this.panOffsetX - event.deltaX;
      let newPanOffsetY = this.panOffsetY - event.deltaY;

      const virtualWidthPx = this.virtualGridWidth * this.cellSize * this.scale;
      const virtualHeightPx = this.virtualGridHeight * this.cellSize * this.scale;

      const minPanOffsetX = this.canvasWidth - virtualWidthPx;
      const minPanOffsetY = this.canvasHeight - virtualHeightPx;

      newPanOffsetX = Math.min(0, Math.max(newPanOffsetX, minPanOffsetX));
      newPanOffsetY = Math.min(0, Math.max(newPanOffsetY, minPanOffsetY));

      this.panOffsetX = newPanOffsetX;
      this.panOffsetY = newPanOffsetY;
    }
  }

  constrainPan() {
    const virtualWidthPx = this.virtualGridWidth * this.cellSize * this.scale;
    const virtualHeightPx = this.virtualGridHeight * this.cellSize * this.scale;
    const minPanOffsetX = this.canvasWidth - virtualWidthPx;
    const minPanOffsetY = this.canvasHeight - virtualHeightPx;
    this.panOffsetX = Math.min(0, Math.max(this.panOffsetX, minPanOffsetX));
    this.panOffsetY = Math.min(0, Math.max(this.panOffsetY, minPanOffsetY));
  }

  calculateGridDimensions() {
    const availableWidth = window.innerWidth * 0.7;
    const availableHeight = window.innerHeight * 0.8;

    this.gridWidth = Math.floor(availableWidth / this.cellSize);
    this.gridHeight = Math.floor(availableHeight / this.cellSize);

    this.canvasWidth = this.gridWidth * this.cellSize;
    this.canvasHeight = this.gridHeight * this.cellSize;
  }

  onCanvasClick(event: MouseEvent) {
    const svgElement = event.currentTarget as SVGSVGElement;
    const rect = svgElement.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;
    const adjustedX = (cursorX - this.panOffsetX) / this.scale;
    const adjustedY = (cursorY - this.panOffsetY) / this.scale;
    const gridX = Math.floor(adjustedX / this.cellSize);
    const gridY = Math.floor(adjustedY / this.cellSize);

    if (this.panels.length < 1 && Mode.EditorMode) {
      // Если панелей нет – добавляем по клику (как раньше)
      this.editorService.addPanelAtCoordinates(
        gridX,
        gridY,
        this.virtualGridWidth,
        this.virtualGridHeight,
        8,
        this.cellSize
      );
    }
  }

  centerGrid(): void {
    // Размер виртуальной сетки в пикселях с учётом текущего масштаба
    const virtualWidthPx = this.virtualGridWidth * this.cellSize * this.scale;
    const virtualHeightPx = this.virtualGridHeight * this.cellSize * this.scale;
    // Центр виртуальной сетки
    const centerX = (virtualWidthPx - this.canvasWidth) / 2;
    const centerY = (virtualHeightPx - this.canvasHeight) / 2;
    // panOffset отрицательный, чтобы перемещать содержимое влево/вверх
    this.panOffsetX = -centerX;
    this.panOffsetY = -centerY;
  }

  showTooltip(event: MouseEvent, panelIndex: number) {
    this.tooltipText = `Панель #${panelIndex}`;
    this.tooltipVisible = true;
    this.updateTooltipPosition(event);
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  // Обновляем позицию tooltip относительно SVG
  updateTooltipPosition(event: MouseEvent) {
    const target = event.currentTarget as Element;
    if (target && typeof target.closest === 'function') {
      const svgElement = target.closest('svg') as SVGSVGElement;
      if (svgElement) {
        const rect = svgElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.tooltipX = x + 10;
        this.tooltipY = y - 10;
      }
    }
  }

  hintVisibleMap: { [key in 'L' | 'R' | 'T' | 'B']?: boolean } = {};

  showHintFor(direction: 'L' | 'R' | 'T' | 'B'): void {
    this.hintVisibleMap[direction] = true;
  }

  hideHintFor(direction: 'L' | 'R' | 'T' | 'B'): void {
    this.hintVisibleMap[direction] = false;
  }

  // В начале класса
  availableDirections: Array<'L' | 'R' | 'T' | 'B'> = ['L', 'R', 'T', 'B'];

// Метод, который вычисляет область для подсказки для заданного направления.
// Если валидация проходит, возвращает объект с координатами, иначе – null.
  getHintArea(direction: 'L' | 'R' | 'T' | 'B'): { gridX: number; gridY: number } | null {
    const panelSize = 8;
    if (this.panels.length === 0) return null;
    const lastPanel = this.panels[this.panels.length - 1];
    let gridX = lastPanel.x;
    let gridY = lastPanel.y;
    switch (direction) {
      case 'L': gridX = lastPanel.x - panelSize; break;
      case 'R': gridX = lastPanel.x + panelSize; break;
      case 'T': gridY = lastPanel.y - panelSize; break;
      case 'B': gridY = lastPanel.y + panelSize; break;
    }
    // Ограничиваем координаты так, чтобы область не выходила за границы виртуальной сетки
    if (gridX < 0) gridX = 0;
    if (gridY < 0) gridY = 0;
    if (gridX > this.virtualGridWidth - panelSize) gridX = this.virtualGridWidth - panelSize;
    if (gridY > this.virtualGridHeight - panelSize) gridY = this.virtualGridHeight - panelSize;
    // Проверка через сервис (или напрямую, если метод уже находится в компоненте)
    const validation = this.editorService.validatePanelPlacement(
      gridX,
      gridY,
      panelSize,
      this.virtualGridWidth,
      this.virtualGridHeight
    );
    return validation.valid ? { gridX: validation.gridX, gridY: validation.gridY } : null;
  }

// Обработчик клика для подсказки – принимает направление
  onAddPanelHintClick(event: MouseEvent, direction: 'L' | 'R' | 'T' | 'B'): void {
    event.stopPropagation();
    const panelSize = 8;
    // Вызов метода сервиса, который добавляет панель в выбранном направлении
    this.editorService.addPanelInDirection(
      direction,
      this.virtualGridWidth,
      this.virtualGridHeight,
      panelSize
    );
  }

  protected readonly Mode = Mode;
}
