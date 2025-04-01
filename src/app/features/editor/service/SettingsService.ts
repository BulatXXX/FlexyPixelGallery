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
    showPanelBorders: true,
    borderColor: 'red',
    showPanelDirections: true,
    drawingColor: 'yellow'
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
