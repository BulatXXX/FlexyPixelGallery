import {Injectable} from '@angular/core';
import {Panel} from '../models/Panel';
import {PaintPixelsCommand} from '../models/Commands/PaintPixelsCommand';
import {CommandManager} from './CommandManager';
import {EditorStateService} from './EditorState.service';
import {Mode} from '../models/Mode';
import {AnimationService} from './AnimationService';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  isDrawing: boolean = false;  // Флаг, показывающий, рисуем ли мы
  pixelsToPaint: { x: number, y: number, panel: Panel , prevColor:string}[] = [];  // Массив пикселей, которые должны быть закрашены

  constructor(private editorService: EditorStateService, private commandManager: CommandManager,private animationService: AnimationService) {
  }

  /**
  Необходимо глобально ловить отпускание мыши, потому что при отпускании
  мыши за пределами компонента событие поднятия не срабатывает
   **/
  initDrawingListeners(): void {
    document.addEventListener('mouseup', this.handleStopDrawing.bind(this));
  }

  handleStartDrawing(panel: Panel, x: number, y: number): void {
    if (this.editorService.setting.mode === Mode.DrawingMode) {
      this.isDrawing = true;
      this.paintPixel(panel, x, y);
    }
  }

  handleMouseMoveDrawing(panel:Panel, x: number, y: number): void {
    if (this.isDrawing) {
      if (!this.isPixelAlreadyAdded(x, y, panel)) {
        // Добавляем пиксель в массив
        this.paintPixel(panel, x, y); // Красим
      }
    }
  }

  handleStopDrawing(): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.executePaintCommand();
      this.pixelsToPaint = [];
      //not sure if i must do this but it works
      document.removeEventListener('mouseup', this.handleStopDrawing.bind(this));
    }
    this.animationService.updateFrame()
  }

  private paintPixel(panel: Panel, x: number, y: number): void {
    const prevColor = panel.pixels[y][x];
    this.pixelsToPaint.push({ x, y, panel,prevColor });
    panel.pixels[y][x] = this.editorService.setting.drawingColor; // Красим пиксель в новый цвет
  }

  private isPixelAlreadyAdded(x: number, y: number, panel: Panel): boolean {
    return this.pixelsToPaint.some(pixel => pixel.x === x && pixel.y === y && pixel.panel.id === panel.id);
  }

  private executePaintCommand(): void {
    const paintCommand = new PaintPixelsCommand(
      this.editorService,
      this.pixelsToPaint,
      this.editorService.setting.drawingColor
    );
    this.commandManager.execute(paintCommand);  // Выполнение команды
  }
}
