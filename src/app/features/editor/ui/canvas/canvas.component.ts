import {Component, HostListener, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {EditorStateService} from '../../service/editor-state.service';
import {Subscription} from 'rxjs';
import {Panel} from '../../models/Panel';
import {MenuComponent} from '../menu/menu.component';
import {CommandManager} from '../../service/CommandManager';
import {AddPanelAtCoordinatesCommand} from '../../models/Commands/AddPanelAtCoordinatesCommand';
import {AddPanelInDirectionCommand} from '../../models/Commands/AddPanelInDirectionCommand';
import {EditorStateSetting} from '../../models/EditorStateSettings';
import {EditorActions} from '../../models/EditorActions';
import {Mode} from '../../models/Mode';
import {RemovePanelCommand} from '../../models/Commands/RemovePanelCommand';

const PANEL_SIZE = 8;

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [NgForOf, NgIf, MenuComponent],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  panels: Panel[] = [];

  settings: EditorStateSetting | undefined;
  scale: number = 1;

  cellSize: number = 20;

  //Виртуальная сетка
  virtualGridWidth: number = 200;
  virtualGridHeight: number = 200;
  //Видимая сетка (значения формируются в методе calculateDimensions)
  gridWidth: number = 0;
  gridHeight: number = 0;
  //Смещение сетки
  panOffsetX: number = 0;
  panOffsetY: number = 0;

  // Вычисляем реальные размеры канваса
  canvasWidth: number = this.gridWidth * this.cellSize;
  canvasHeight: number = this.gridHeight * this.cellSize;

  // Свойства tooltip
  tooltipText: string = '';
  tooltipX: number = 0;
  tooltipY: number = 0;
  tooltipVisible: boolean = false;

  // Свойства deleteHint
  deleteHintVisible: boolean = false;


  private actionSubscription!: Subscription;
  private panelsSubscription!: Subscription;
  private settingSubscription!: Subscription;

  hintVisibleMap: { [key in 'L' | 'R' | 'T' | 'B']?: boolean } = {};
  availableDirections: Array<'L' | 'R' | 'T' | 'B'> = ['L', 'R', 'T', 'B'];

  ngOnInit() {
    this.calculateGridDimensions();
    this.centerGrid();

    this.subscribeEditorState();
  }

  private subscribeEditorState() {
    this.panelsSubscription = this.editorService.panels$.subscribe(panels => {
      this.panels = panels;
    });
    this.settingSubscription= this.editorService.setting$.subscribe(setting => {
      this.settings = setting;
    });
    this.actionSubscription = this.editorService.action$.subscribe(action => {
      switch (action) {
        case EditorActions.CenterGrid : {
          this.centerGrid();
          break;
        }
      }
    });
  }

// При изменении размера окна пересчитываем размеры сетки
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateGridDimensions();
    this.constrainVisibleCanvas()
  }

  constructor(private editorService: EditorStateService, private commandManager: CommandManager) {
  }

// Обработчик события wheel для панорамирования
  onWheel(event: WheelEvent) {
    event.preventDefault();
    const svgElement = event.currentTarget as SVGSVGElement;
    const rect = svgElement.getBoundingClientRect();

    if (event.ctrlKey) {
      // Масштабирование
      this.applyZoom(event, rect);
    } else {
      //Перемещение
      this.applyOffset(event);

    }
  }

  private applyOffset(event: WheelEvent) {
    let newPanOffsetX = this.panOffsetX - event.deltaX;
    let newPanOffsetY = this.panOffsetY - event.deltaY;
    this.constrainVisibleCanvas(newPanOffsetX, newPanOffsetY);
  }

  private applyZoom(event: WheelEvent, rect: DOMRect) {
    const zoomFactor = 1.05;
    let newScale = event.deltaY < 0 ? this.scale * zoomFactor : this.scale / zoomFactor;

    newScale = Math.max(0.5, Math.min(newScale, 3));

    // Позиция указателя относительно SVG
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;

    // Корректировка смещения, чтобы указатель оставался на том же месте
    this.panOffsetX = pointerX - (newScale / this.scale) * (pointerX - this.panOffsetX);
    this.panOffsetY = pointerY - (newScale / this.scale) * (pointerY - this.panOffsetY);

    this.scale = newScale;
    this.constrainVisibleCanvas();
  }

//Ограничивает смещение (panOffsetX/Y) так, чтобы видимая область не вышла за виртуальную сетку
  private constrainVisibleCanvas(newPanOffsetX:number = this.panOffsetX,newPanOffsetY:number = this.panOffsetY) {
    const virtualWidthPx = this.virtualGridWidth * this.cellSize * this.scale;
    const virtualHeightPx = this.virtualGridHeight * this.cellSize * this.scale;
    const minPanOffsetX = this.canvasWidth - virtualWidthPx;
    const minPanOffsetY = this.canvasHeight - virtualHeightPx;
    this.panOffsetX = Math.min(0, Math.max(newPanOffsetX, minPanOffsetX));
    this.panOffsetY = Math.min(0, Math.max(newPanOffsetY, minPanOffsetY));
  }

  private calculateGridDimensions() {
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
      this.commandManager.execute(
        new AddPanelAtCoordinatesCommand(
          this.editorService,
          gridX,
          gridY,
          PANEL_SIZE,
          this.virtualGridWidth,
          this.virtualGridHeight,
        )
      );
    }
  }

  private centerGrid(): void {
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

  toggleHintForDirection(direction: 'L' | 'R' | 'T' | 'B'): void {
    this.hintVisibleMap[direction] = !this.hintVisibleMap[direction];
  }

// Метод, который вычисляет область для подсказки для заданного направления.
// Если валидация проходит, возвращает объект с координатами, иначе – null.
  getHintArea(direction: 'L' | 'R' | 'T' | 'B'): { gridX: number; gridY: number } | null {
    if (this.panels.length === 0) return null;
    const lastPanel = this.panels[this.panels.length - 1];
    let gridX = lastPanel.x;
    let gridY = lastPanel.y;
    switch (direction) {
      case 'L': gridX = lastPanel.x - PANEL_SIZE; break;
      case 'R': gridX = lastPanel.x + PANEL_SIZE; break;
      case 'T': gridY = lastPanel.y - PANEL_SIZE; break;
      case 'B': gridY = lastPanel.y + PANEL_SIZE; break;
    }
    // Ограничиваем координаты так, чтобы область не выходила за границы виртуальной сетки
    if (gridX < 0) gridX = 0;
    if (gridY < 0) gridY = 0;
    if (gridX > this.virtualGridWidth - PANEL_SIZE) gridX = this.virtualGridWidth - PANEL_SIZE;
    if (gridY > this.virtualGridHeight - PANEL_SIZE) gridY = this.virtualGridHeight - PANEL_SIZE;
    // Проверка через сервис
    const validation = this.editorService.validatePanelPlacement(
      gridX,
      gridY,
      PANEL_SIZE,
      this.virtualGridWidth,
      this.virtualGridHeight
    );
    return validation.valid ? { gridX: validation.gridX, gridY: validation.gridY } : null;
  }

// Обработчик клика для подсказки – принимает направление
  onAddPanelHintClick(event: MouseEvent, direction: 'L' | 'R' | 'T' | 'B'): void {
    event.stopPropagation();
    // Вызов метода сервиса, который добавляет панель в выбранном направлении
    this.commandManager.execute(
      new AddPanelInDirectionCommand(
        this.editorService,
        direction,
        this.virtualGridWidth,
        this.virtualGridHeight,
        PANEL_SIZE
      )
    )
  }

  protected readonly Mode = Mode;
  protected readonly PANEL_SIZE = PANEL_SIZE;

  toggleDeleteHint() {
    this.deleteHintVisible = !this.deleteHintVisible;
  }

  onRemovePanelClick(event: MouseEvent) {
    event.stopPropagation()
    this.toggleDeleteHint()
    this.hideTooltip()
    const lastPanel = this.panels[this.panels.length - 1];
    this.commandManager.execute(new RemovePanelCommand(
      this.editorService,
      lastPanel
    ));
  }
}
