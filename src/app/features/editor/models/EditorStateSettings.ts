import {Mode} from './Mode';

export interface EditorStateSetting {
  mode: Mode;
  showPanelBorders: boolean;
  borderColor: string;
  showPanelDirections: boolean;
  //inspector settings
  drawingColor: string;
  paletteColors: string[];
  selectedColorIndex: number | null;
  pipetteActive: boolean;
  // imageAttaching: {
  //   coverage: 'cover' | 'fit';
  //   target: 'current'
  //   selectedFrames: []
  // }
}
