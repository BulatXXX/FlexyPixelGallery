import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Panel} from '../models/Panel';
import {Mode} from '../models/Mode';
import {EditorStateSetting} from '../models/EditorStateSettings';

@Injectable({
  providedIn: 'root'
})
export class EditorStateService {

  configId: string = 'config_1';

  // Храним список панелей через BehaviorSubject
  private panelsSubject = new BehaviorSubject<Panel[]>([]);
  panels$ = this.panelsSubject.asObservable();
  get panels(): Panel[] {
    return this.panelsSubject.getValue();
  }

  // Храним текущий режим
  private settingSubject = new BehaviorSubject<EditorStateSetting>({
    mode: Mode.SpectatorMode,
    showPanelBorders: true,
    borderColor: 'red',
    showPanelDirections: true,
  });
  setting$ = this.settingSubject.asObservable();
  get setting(): EditorStateSetting {
    return this.settingSubject.getValue();
  }
  set setting(setting: EditorStateSetting){
    this.settingSubject.next(setting);
  }

  setMode(mode: Mode): void {
    this.setting.mode = mode;
  }

  toggleBorders() {
    this.setting.showPanelBorders = !this.setting.showPanelBorders;
  }

  toggleDirections() {
    this.setting.showPanelDirections = !this.setting.showPanelDirections;
  }

  // Если требуется передавать какие-либо действия
  private actionSubject = new Subject<string>();
  action$ = this.actionSubject.asObservable();

  // Метод для добавления панели
  addPanel(panel: Panel) {
    this.panelsSubject.next([...this.panels, panel]);
  }
  removePanel(panel_id: string) {
    this.panelsSubject.next(this.panels.filter(p => p.id !== panel_id));
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


  createEmptyPanel(rows: number, cols: number): string[][] {
    return Array.from({ length: rows }, () => Array(cols).fill('#ffffff'));
  }

  insertPanelAt(panel: Panel, index: number): void {
    const panels = this.panels;
    panels.splice(index, 0, panel);
    this.panelsSubject.next([...panels]);
  }

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

  addPanelAtCoordinates(
    gridX: number,
    gridY: number,
    virtualGridWidth: number,
    virtualGridHeight: number,
    panelSize: number,
  ): boolean {
    if(this.setting.mode !== Mode.EditorMode){
      return false;
    }
    const validation = this.validatePanelPlacement(gridX, gridY, panelSize, virtualGridWidth, virtualGridHeight);
    if (!validation.valid) {
      return false;
    }

    const newPanel = this.createPanel(validation.gridX, validation.gridY, panelSize);
    this.addPanel(newPanel);
    return true;
  }

  triggerAction(action: string) {
    this.actionSubject.next(action);
  }

}
