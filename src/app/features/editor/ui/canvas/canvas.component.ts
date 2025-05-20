import {Component, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {PanelStateService} from '../../service/PanelStateService';
import {Subscription} from 'rxjs';
import {Direction, Panel} from '../../models/Panel';
import {CommandManager} from '../../service/CommandManager';
import {AddPanelAtCoordinatesCommand} from '../../models/Commands/AddPanelAtCoordinatesCommand';
import {AddPanelInDirectionCommand} from '../../models/Commands/AddPanelInDirectionCommand';
import {EditorActions} from '../../models/EditorActions';
import {Mode} from '../../models/Mode';
import {RemovePanelCommand} from '../../models/Commands/RemovePanelCommand';
import {DrawingService} from '../../service/DrawingService';
import {SettingsService} from '../../service/SettingsService';
import {ImageAttachingService, SelectionRect} from '../../service/ImageAttachingService';


const PANEL_SIZE = 8;

const EDGE_TOL = 0.1;

type HandleId = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r' | 'inside';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {

  panels: Panel[] = [];

  scale: number = 1;

  cellSize: number = 20;

  virtualGridWidth: number = 400;
  virtualGridHeight: number = 200;

  panOffsetX: number = 0;
  panOffsetY: number = 0;

  @Input() canvasWidth: number = 0;
  @Input() canvasHeight: number = 0;

  tooltipText: string = '';
  tooltipX: number = 0;
  tooltipY: number = 0;
  tooltipVisible: boolean = false;

  deleteHintVisible: boolean = false;

  private actionSubscription!: Subscription;
  private panelsSubscription!: Subscription;

  hintVisibleMap: { [key in Direction]?: boolean } = {};
  availableDirections = [Direction.Top, Direction.Right, Direction.Bottom, Direction.Left];

  selection: SelectionRect | null = null;
  private selSub?: Subscription;
  private resizing = false;

  private activeHandle: HandleId | null = null;
  private dragStartPoint: { gx: number; gy: number } | null = null;
  private startRect!: SelectionRect;   // сохраняем прямоугольник в момент mousedown


  private subscribeEditorState() {
    this.panelsSubscription = this.editorService.panels$.subscribe(panels => {
      this.panels = panels;
    });
    this.actionSubscription = this.editorService.action$.subscribe(action => {
      switch (action) {
        case EditorActions.CenterGrid : {
          this.centerGrid();
          break;
        }
        // case EditorActions.ZoomIn:{
        //   this.scale*=1.05;
        //   break;
        // }
        // case EditorActions.ZoomOut:{
        //   this.scale/=1.05;
        //   break;
        // }
      }
    });
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.constrainVisibleCanvas()
  }

  constructor(protected editorService: PanelStateService,
              private commandManager: CommandManager,
              protected drawingService: DrawingService,
              protected settingsService: SettingsService,
              private imageAttachingService: ImageAttachingService,
              private elRef: ElementRef<SVGSVGElement>
  ) {
  }

  ngOnDestroy(): void {
    this.selSub?.unsubscribe();
  }

  ngOnInit() {

    this.centerGrid();

    this.drawingService.initDrawingListeners()

    this.subscribeEditorState();

    this.selSub = this.imageAttachingService.selection$.subscribe(sel => this.selection = sel);

  }

  private detectHandle(gx: number, gy: number): HandleId | null {
    if (!this.selection) {
      return null;
    }
    const {startX, startY, endX, endY} = this.selection;
    const minX = Math.min(startX, endX), maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY), maxY = Math.max(startY, endY);
    const near = (v: number, r: number) => Math.abs(v - r) <= EDGE_TOL;
    if (near(gx, minX) && near(gy, minY)) return 'tl';
    if (near(gx, maxX) && near(gy, minY)) return 'tr';
    if (near(gx, minX) && near(gy, maxY)) return 'bl';
    if (near(gx, maxX) && near(gy, maxY)) return 'br';
    if (near(gy, minY) && gx >= minX && gx <= maxX) return 't';
    if (near(gy, maxY) && gx >= minX && gx <= maxX) return 'b';
    if (near(gx, minX) && gy >= minY && gy <= maxY) return 'l';
    if (near(gx, maxX) && gy >= minY && gy <= maxY) return 'r';
    if (gx > minX && gx < maxX && gy > minY && gy < maxY) return 'inside';
    return null;
  }

  private cursorFor(h: HandleId | null): string {
    return ({
      tl: 'nw-resize', tr: 'ne-resize', bl: 'sw-resize', br: 'se-resize',
      t: 'n-resize', b: 's-resize', l: 'w-resize', r: 'e-resize',
      inside: 'move'
    } as Record<HandleId, string>)[h as HandleId] ?? 'default';
  }

  private clientToGrid(evt: MouseEvent): { gx: number; gy: number } {
    const svgRect = this.elRef.nativeElement.getBoundingClientRect();
    const x = (evt.clientX - svgRect.left - this.panOffsetX) / (this.cellSize * this.scale);
    const y = (evt.clientY - svgRect.top - this.panOffsetY) / (this.cellSize * this.scale);
    return {gx: Math.floor(x), gy: Math.floor(y)};
  }

  private isMousePanning = false;
  private lastMousePos = { x: 0, y: 0 };

  onMouseDown(evt: MouseEvent): void {
    if (evt.button === 1) {
      this.startPan(evt);
      evt.preventDefault();
      return;
    }

    if (this.settingsService.setting?.mode === Mode.ImageAttaching && evt.button === 0) {
      this.startAreaSelection(evt);
      evt.stopPropagation();
    }
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.isMousePanning) {
      this.movePan(evt);
      return;
    }

    if (this.settingsService.setting?.mode === Mode.ImageAttaching) {
      this.handleAreaSelection(evt);
    }
  }

  onMouseUp(evt: MouseEvent): void {
    if (evt.button === 1 && this.isMousePanning) {
      this.endPan();
      return;
    }
    if (this.resizing && this.settingsService.setting?.mode === Mode.ImageAttaching) {
      this.stopAreaSelection();
    }
  }
  private isMouseWheelEvent(event: WheelEvent): boolean {
    // 1) Строковый режим — точно мышь
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      return true;
    }
    // 2) Пиксельный режим, но крупная дельта — скорее мышь
    if (
      event.deltaMode === WheelEvent.DOM_DELTA_PIXEL &&
      Math.abs(event.deltaY) > 20
    ) {
      return true;
    }
    // Иначе — тачпад
    return false;
  }
  private startPan(evt: MouseEvent) {
    this.isMousePanning = true;
    this.lastMousePos = { x: evt.clientX, y: evt.clientY };
  }
  private movePan(evt: MouseEvent) {
    const dx = evt.clientX - this.lastMousePos.x;
    const dy = evt.clientY - this.lastMousePos.y;
    this.lastMousePos = { x: evt.clientX, y: evt.clientY };

    this.panOffsetX += dx;
    this.panOffsetY += dy;
    this.constrainVisibleCanvas(this.panOffsetX, this.panOffsetY);
  }
  private endPan() {
    this.isMousePanning = false;
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const svgElement = event.currentTarget as SVGSVGElement;
    const rect = svgElement.getBoundingClientRect();
    if (this.isMouseWheelEvent(event)|| event.ctrlKey) {
      this.applyZoom(event, rect);
    } else {
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

  private startAreaSelection(evt: MouseEvent) {
    const {gx, gy} = this.clientToGrid(evt);
    const handle = this.detectHandle(gx, gy);

    if (this.selection && handle) {          // уже есть выделение
      this.startRect = {...this.selection};
      if (handle === 'inside') {
        this.imageAttachingService.startDrag(gx, gy);
      } else {
        this.imageAttachingService.startHandleResize(handle as Exclude<HandleId, 'inside'>);
      }
      this.activeHandle = handle;
      this.dragStartPoint = {gx, gy};
      this.resizing = true;
    } else if (!this.selection) {
      this.imageAttachingService.beginSelection(gx, gy);
      this.activeHandle = 'br';
      this.resizing = true;
    }
  }
  private handleAreaSelection(evt: MouseEvent) {
    const {gx, gy} = this.clientToGrid(evt);

    (this.elRef.nativeElement as SVGSVGElement).style.cursor = this.cursorFor(this.detectHandle(gx, gy));

    if (!this.resizing) {
      return;
    }

    if (this.activeHandle === 'inside') {
      this.imageAttachingService.updateDrag(gx, gy);
    } else {
      this.imageAttachingService.updateHandleResize(gx, gy);
    }
  }
  private stopAreaSelection() {
    this.imageAttachingService.endInteraction();
    this.resizing = false;
    this.activeHandle = null;
    (this.elRef.nativeElement as SVGSVGElement).style.cursor = 'default';
  }

  private constrainVisibleCanvas(newPanOffsetX: number = this.panOffsetX, newPanOffsetY: number = this.panOffsetY) {
    const virtualWidthPx = this.virtualGridWidth * this.cellSize * this.scale;
    const virtualHeightPx = this.virtualGridHeight * this.cellSize * this.scale;
    const minPanOffsetX = this.canvasWidth - virtualWidthPx;
    const minPanOffsetY = this.canvasHeight - virtualHeightPx;
    this.panOffsetX = Math.min(0, Math.max(newPanOffsetX, minPanOffsetX));
    this.panOffsetY = Math.min(0, Math.max(newPanOffsetY, minPanOffsetY));
  }

  private centerGrid(): void {

    const virtualWidthPx = this.virtualGridWidth * this.cellSize * this.scale;
    const virtualHeightPx = this.virtualGridHeight * this.cellSize * this.scale;

    const centerX = (virtualWidthPx - this.canvasWidth) / 2;
    const centerY = (virtualHeightPx - this.canvasHeight) / 2;

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

  toggleHintForDirection(direction: Direction, hintVisible: boolean): void {
    this.hintVisibleMap[direction] = hintVisible;
  }

  getHintArea(direction: Direction): { gridX: number; gridY: number } | null {
    if (this.panels.length === 0) return null;
    const lastPanel = this.panels[this.panels.length - 1];
    let gridX = lastPanel.x;
    let gridY = lastPanel.y;
    switch (direction) {
      case Direction.Left:
        gridX = lastPanel.x - PANEL_SIZE;
        break;
      case Direction.Right:
        gridX = lastPanel.x + PANEL_SIZE;
        break;
      case Direction.Top:
        gridY = lastPanel.y - PANEL_SIZE;
        break;
      case Direction.Bottom:
        gridY = lastPanel.y + PANEL_SIZE;
        break;
    }
    // Ограничиваем координаты так, чтобы область не выходила за границы виртуальной сетки
    if (gridX < 0) gridX = 0;
    if (gridY < 0) gridY = 0;
    if (gridX > this.virtualGridWidth - PANEL_SIZE) gridX = this.virtualGridWidth - PANEL_SIZE;
    if (gridY > this.virtualGridHeight - PANEL_SIZE) gridY = this.virtualGridHeight - PANEL_SIZE;
    const validation = this.editorService.validatePanelPlacement(
      gridX,
      gridY,
      PANEL_SIZE,
      this.virtualGridWidth,
      this.virtualGridHeight
    );
    return validation.valid ? {gridX: validation.gridX, gridY: validation.gridY} : null;
  }

  onAddPanelOnCanvas(event: MouseEvent) {
    if (this.panels.length > 0 || this.settingsService.setting.mode !== Mode.EditorMode) {
      return
    }
    const svgElement = event.currentTarget as SVGSVGElement;
    const rect = svgElement.getBoundingClientRect();

    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    const adjustedX = (cursorX - this.panOffsetX) / this.scale;
    const adjustedY = (cursorY - this.panOffsetY) / this.scale;

    const gridX = Math.floor(adjustedX / this.cellSize);
    const gridY = Math.floor(adjustedY / this.cellSize);

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

  onAddPanelByHintClick(event: MouseEvent, direction: Direction): void {
    event.stopPropagation();
    this.commandManager.execute(
      new AddPanelInDirectionCommand(
        this.editorService,
        direction,
        this.virtualGridWidth,
        this.virtualGridHeight,
        PANEL_SIZE
      )
    )
    this.toggleHintForDirection(direction, false)
  }

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

  @HostListener('window:keydown', ['$event'])
  onKeyDown(evt: KeyboardEvent) {
    // при нажатии Alt или Option
    if (evt.key === 'Alt' || evt.key === 'Option') {
      this.settingsService.setting.pipetteActive = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(evt: KeyboardEvent) {
    if (evt.key === 'Alt' || evt.key === 'Option') {
      this.settingsService.setting.pipetteActive = false;
    }
  }

  protected readonly Mode = Mode;
  protected readonly PANEL_SIZE = PANEL_SIZE;
  protected readonly Direction = Direction;

  protected readonly Math = Math;

}
