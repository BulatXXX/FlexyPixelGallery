import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {Panel} from '../models/Panel';

export enum EditorActions {
  CenterGrid = 'centerGrid',
  TurnSpectatorMode = 'turnSpectatorMode',
  TurnEditorMode = 'turnEditorMode',
}

export enum Mode {
  SpectatorMode,
  EditorMode,
}

@Injectable({
  providedIn: 'root'
})
export class EditorStateService {

  configId: string = 'config_1';

  // Храним список панелей через BehaviorSubject
  private panelsSubject = new BehaviorSubject<Panel[]>([]);
  panels$ = this.panelsSubject.asObservable();
  // Для удобного доступа к текущему списку панелей
  get panels(): Panel[] {
    return this.panelsSubject.getValue();
  }
  // Метод для добавления панели
  addPanel(panel: Panel) {
    this.panelsSubject.next([...this.panels, panel]);
  }

  validatePanelPlacement(
    gridX: number,
    gridY: number,
    panelSize: number,
    virtualGridWidth: number,
    virtualGridHeight: number
  ): { valid: boolean, gridX: number, gridY: number } {
    let adjustedX = gridX;
    let adjustedY = gridY;

    if (adjustedX < 0) {
      adjustedX = 0;
    } else if (adjustedX > virtualGridWidth - panelSize) {
      adjustedX = virtualGridWidth - panelSize;
    }
    if (adjustedY < 0) {
      adjustedY = 0;
    } else if (adjustedY > virtualGridHeight - panelSize) {
      adjustedY = virtualGridHeight - panelSize;
    }

    const overlap = this.panels.some(panel => {
      return !(
        adjustedX + panelSize <= panel.x ||
        adjustedX >= panel.x + panelSize ||
        adjustedY + panelSize <= panel.y ||
        adjustedY >= panel.y + panelSize
      );
    });

    return { valid: !overlap, gridX: adjustedX, gridY: adjustedY };
  }


  // Метод для создания пустой панели (8x8) – можно вынести и создание пустой матрицы
  createEmptyPanel(rows: number, cols: number): string[][] {
    return Array.from({ length: rows }, () => Array(cols).fill('#ffffff'));
  }

  // Метод для создания новой панели
  createPanel(
    gridX: number,
    gridY: number,
    panelSize: number
  ): Panel {
    const newId = `${this.configId}_${this.panels.length + 1}`;
    // По умолчанию новый панель наследует направление предыдущей
    const newDirection = this.panels.length > 0 ? this.panels[this.panels.length - 1].direction : 'B';
    return {
      id: newId,
      x: gridX,
      y: gridY,
      direction: newDirection,
      pixels: this.createEmptyPanel(panelSize, panelSize)
    };
  }

  addPanelInDirection(
    direction: 'L' | 'R' | 'T' | 'B',
    virtualGridWidth: number,
    virtualGridHeight: number,
    panelSize: number
  ): boolean {
    const panels = this.panels;
    if (panels.length === 0) {
      return false; // если панелей нет, можно использовать другой метод
    }
    const lastPanel = panels[panels.length - 1];
    let newX = lastPanel.x;
    let newY = lastPanel.y;
    switch (direction) {
      case 'R': newX = lastPanel.x + panelSize; break;
      case 'L': newX = lastPanel.x - panelSize; break;
      case 'T': newY = lastPanel.y - panelSize; break;
      case 'B': newY = lastPanel.y + panelSize; break;
    }
    // Ограничиваем, чтобы новая панель не выходила за виртуальную сетку
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > virtualGridWidth - panelSize) newX = virtualGridWidth - panelSize;
    if (newY > virtualGridHeight - panelSize) newY = virtualGridHeight - panelSize;
    // Проверяем перекрытие
    const validation = this.validatePanelPlacement(newX, newY, panelSize, virtualGridWidth, virtualGridHeight);
    if (!validation.valid) {
      return false;
    }
    // Обновляем направление последней панели – теперь оно равно выбранному направлению
    lastPanel.direction = direction;
    const newPanel: Panel = {
      id: `${this.configId}_${this.panels.length + 1}`,
      x: validation.gridX,
      y: validation.gridY,
      direction: direction,
      pixels: this.createEmptyPanel(panelSize, panelSize)
    };
    this.addPanel(newPanel);
    return true;
  }

  // Метод, который объединяет валидацию, создание и добавление панели
  addPanelAtCoordinates(
    gridX: number,
    gridY: number,
    virtualGridWidth: number,
    virtualGridHeight: number,
    panelSize: number,
    cellSize: number
  ): boolean {
    const validation = this.validatePanelPlacement(gridX, gridY, panelSize, virtualGridWidth, virtualGridHeight);
    if (!validation.valid) {
      return false;
    }
    const newPanel = this.createPanel(validation.gridX, validation.gridY, panelSize);
    this.addPanel(newPanel);
    return true;
  }


  // Храним текущий режим
  private modeSubject = new BehaviorSubject<Mode>(Mode.EditorMode);
  mode$ = this.modeSubject.asObservable();

  // Если требуется передавать какие-либо действия
  private actionSubject = new Subject<string>();
  action$ = this.actionSubject.asObservable();

  triggerAction(action: string) {
    this.actionSubject.next(action);
  }

  // Метод для переключения режима
  setMode(mode: Mode) {
    this.modeSubject.next(mode);
  }
}
