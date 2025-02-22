import {Injectable} from '@angular/core';
import {Panel} from '../models/Panel';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorStateService {
  private actionSubject = new Subject<string>();
  action$ = this.actionSubject.asObservable();

  triggerAction(action: string) {
    this.actionSubject.next(action);
  }

}

export enum EditorActions {
  CenterGrid = 'centerGrid',
  TurnSpectatorMode = 'turnSpectatorMode',
  TurnEditorMode = 'turnEditorMode',
}

export enum Mode{
  SpectatorMode,
  EditorMode,
}

