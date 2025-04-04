import {Mode} from './Mode';

export interface EditorStateSetting {
  mode: Mode;
  showPanelBorders: boolean;
  borderColor: string;
  showPanelDirections: boolean;
  //inspector settings
  drawingColor: string;
}
