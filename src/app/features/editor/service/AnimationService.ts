import { Injectable } from '@angular/core';
import {Frame} from '../models/Frame';
import {PanelStateService} from './PanelStateService';


@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private frames: Frame[] = [];
  private currentFrameIndex: number = 0;

  private counter = 0;

  constructor(private editorStateService: PanelStateService) {

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
      this.frames.push(this.createDefaultFrame());
    }
    // Если нужный кадр отсутствует, заполняем массив кадрами по умолчанию до нужного индекса.
    while (this.frames.length <= index) {
      this.duplicateCurrentFrame()
      //this.frames.push(this.createDefaultFrame());
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
    // Если кадров ещё нет, создаем новый пустой кадр

      // Получаем текущий кадр и делаем глубокую копию
      const currentFrame = this.frames[this.currentFrameIndex];
      const newFrame = JSON.parse(JSON.stringify(currentFrame));
      // Вставляем новый кадр сразу после текущего
      this.frames.splice(this.currentFrameIndex + 1, 0, newFrame);
      // Обновляем текущий индекс кадра
      this.currentFrameIndex++;

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




}
