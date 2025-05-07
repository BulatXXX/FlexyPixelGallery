import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {EditorStateSetting} from '../models/EditorStateSettings';
import {Mode} from '../models/Mode';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() {

  }
  private settingSubject = new BehaviorSubject<EditorStateSetting>({
    mode: Mode.SpectatorMode,
    showPanelBorders: false,
    borderColor: 'red',
    showPanelDirections: false,
    drawingColor: 'red',
    paletteColors: [
      '#FF6B6B', // коралловый
      '#F7B801', // желтый
      '#6BCB77', // мятный
      '#4D96FF', // небесно-голубой
      '#845EC2', // лавандовый
      '#FF9671', // персиковый
      '#FFC75F', // лимонный
      '#00C9A7', // бирюзовый
      '#0081CF', // васильковый
    ],
    selectedColorIndex: null ,
    pipetteActive: false

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
}
