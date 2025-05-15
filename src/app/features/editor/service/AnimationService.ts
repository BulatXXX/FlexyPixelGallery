import {Injectable} from '@angular/core';
import {Frame} from '../models/Frame';
import {PanelStateService} from './PanelStateService';
import {BehaviorSubject} from 'rxjs';
import {Panel} from '../models/Panel';


@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  private framesSubject = new BehaviorSubject<Frame[]>([]);
  public frames$ = this.framesSubject.asObservable();
  get frames(): Frame[] {
    return this.framesSubject.getValue();
  }

  set frames(newFrames: Frame[]) {
    this.framesSubject.next(newFrames);
  }

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$ = this.isPlayingSubject.asObservable();
  get isPlaying(): boolean {
    return this.isPlayingSubject.getValue();
  }
  set isPlaying(newValue: boolean) {
    this.isPlayingSubject.next(newValue);
  }


  private currentFrameIndexSubject = new BehaviorSubject<number>(0);

  public currentFrameIndex$ = this.currentFrameIndexSubject.asObservable();
  get currentFrameIndex(): number {
    return this.currentFrameIndexSubject.getValue();
  }

  set currentFrameIndex(index: number) {
    this.currentFrameIndexSubject.next(index);
  }
  private counter = 0;

  constructor(private editorStateService: PanelStateService) {
    this.frames = [this.createDefaultFrame()]
    this.editorStateService.panels$.subscribe(panels => {
      this.ensureAllFramesContainPanels(panels);
    });
  }

  applyFrame(frame: Frame): void {
    const panels = this.editorStateService.panels;
    const updatedPanels = panels.map(panel => {
      const framePixels = frame.panelPixelColors[panel.id];
      if (framePixels) {
        // Создаем глубокую копию матрицы, чтобы избежать ссылочных проблем
        return { ...panel, pixels: JSON.parse(JSON.stringify(framePixels)) };
      }
      return panel;
    });
    // Обновляем состояние панелей
    this.editorStateService.updatePanels(updatedPanels);
  }

  selectFrame(index: number): void {
    if(this.frames.length==0){
      this.frames = [this.createDefaultFrame()];
    }
    while (this.frames.length <= index) {
      this.duplicateCurrentFrame()
    }
    this.currentFrameIndex = index;
    const frame = this.frames[index];
    this.applyFrame(frame);
  }

  private createDefaultFrame(): Frame {

    const panelPixelColors: { [panelId: string]: string[][] } = {};
    const panels = this.editorStateService.panels;
    if (panels.length === 0) {
      // Если панелей нет, возвращаем пустой объект
      return { panelPixelColors };
    }
    // Для каждой панели создаем матрицу, заполненную "#ffffff"
    panels.forEach(panel => {
      const rows = panel.pixels.length;
      const cols = panel.pixels[0].length;
      panelPixelColors[panel.id] = this.createEmptyMatrix(rows, cols);
    });
    this.counter++;
    return { panelPixelColors };
  }

  private createEmptyMatrix(rows: number, cols: number): string[][] {
    let color = '#ffffff';
    return Array.from({ length: rows }, () => Array(cols).fill(color));
  }


  updateFrame(): void {
    if(this.frames.length==0){
      this.frames.push(this.createDefaultFrame());
    }
    const panels = this.editorStateService.panels;
    const newPanelPixelColors: { [panelId: string]: string[][] } = {};

    panels.forEach(panel => {
      // Глубокое копирование матрицы пикселей для каждой панели
      newPanelPixelColors[panel.id] = JSON.parse(JSON.stringify(panel.pixels));
    });

    if (this.frames.length > this.currentFrameIndex) {
      // Если текущий кадр уже существует, обновляем его раскраску
      this.frames[this.currentFrameIndex].panelPixelColors = newPanelPixelColors;
    } else {
      // Если по какой-то причине кадр отсутствует, добавляем новый
      this.frames.push({ panelPixelColors: newPanelPixelColors });
      this.currentFrameIndex = this.frames.length - 1;
    }
  }

  duplicateCurrentFrame(): void {
    const currentIndex = this.currentFrameIndex;
    const currentFrame = this.frames[currentIndex];
    // Глубокое копирование текущего кадра
    const newFrame = JSON.parse(JSON.stringify(currentFrame));
    // Создаем новый массив кадров с вставленным дублированным кадром
    this.frames = [
      ...this.frames.slice(0, currentIndex + 1),
      newFrame,
      ...this.frames.slice(currentIndex + 1)
    ];
    this.currentFrameIndex = currentIndex + 1;
  }

  private animationIntervalId: any = null;
  private readonly MAX_FRAME = 585;
  private readonly fps = 60;


  playAnimation(): void {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;

    // на всякий случай очищаем старый таймер
    if (this.animationIntervalId != null) {
      clearInterval(this.animationIntervalId);
    }

    this.animationIntervalId = setInterval(() => {
      if (this.currentFrameIndex >= this.frames.length) {
        this.pauseAnimation();
        this.selectFrame(0)
      } else {
        this.selectFrame(this.currentFrameIndex);
        this.currentFrameIndex++;
      }
    }, 1000 / this.fps);
  }

  pauseAnimation(): void {
    if (this.animationIntervalId != null) {
      clearInterval(this.animationIntervalId);
      this.animationIntervalId = null;
    }
    this.isPlaying = false;
  }

  private ensureAllFramesContainPanels(panels: Panel[]): void {
    let frames = this.frames;
    let updated = false;

    const newFrames = frames.map(frame => {
      const newPanelPixelColors = { ...frame.panelPixelColors };
      panels.forEach(panel => {
        if (!(panel.id in newPanelPixelColors)) {
          newPanelPixelColors[panel.id] = this.createEmptyMatrix(8,8);
          updated = true;
        }
      });
      return { panelPixelColors: newPanelPixelColors };
    });

    if (updated) {
      this.frames = newFrames;
    }
  }

  /** Кол-во кадров в анимации */
  get framesCount(): number {
    return this.frames.length;
  }

  /** Цвет конкретного пикселя выбранного кадра */
  getPixelColor(frameIdx: number, panelIdx: number, x: number, y: number): string {
    const frame = this.frames[frameIdx];
    const panel = this.editorStateService.panels[panelIdx];
    const matrix = frame?.panelPixelColors[panel?.id];
    return matrix?.[y]?.[x] ?? '#ffffff';   // по умолчанию белый
  }

  /** Установить цвет пикселя (и визуально обновить, если текущий кадр) */
  setPixelColor(frameIdx: number, panelIdx: number, x: number, y: number, color: string): void {
    const frame = this.frames[frameIdx];
    const panel = this.editorStateService.panels[panelIdx];
    if (!frame || !panel) { return; }

    let matrix = frame.panelPixelColors[panel.id];
    if (!matrix) {
      matrix = this.createEmptyMatrix(8, 8);
      frame.panelPixelColors[panel.id] = matrix;
    }
    matrix[y][x] = color;

    // если меняем активный кадр — сразу красим панель, чтобы канвас отобразился
    if (frameIdx === this.currentFrameIndex) {
      panel.pixels[y][x] = color;
    }
  }


}
