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

  playAnimation(): void {
    const fps = 21;
    let frameIndex = 0;
    const intervalId = setInterval(() => {
      if (frameIndex >= this.frames.length) {
        clearInterval(intervalId);
      } else {
        this.selectFrame(frameIndex);
        frameIndex++;
      }
    }, 1000 / fps);
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



}
