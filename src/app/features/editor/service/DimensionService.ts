import {Injectable} from '@angular/core';
import {BehaviorSubject, fromEvent} from 'rxjs';


export interface Dimensions {
  width: number;
  height: number;
}

export interface EditorComponentsDimensions {
  menuDimensions: Dimensions,
  inspectorDimensions: Dimensions,
  canvasDimensions: Dimensions,
  toolsDimensions: Dimensions,
  previewDimensions: Dimensions,
}

@Injectable({
  providedIn: 'root'
})
export class DimensionService {
  private dimensionsSubject = new BehaviorSubject<EditorComponentsDimensions>(this.calculateDimensions());
  dimensions$ = this.dimensionsSubject.asObservable();

  constructor() {
    fromEvent(window, 'resize')
      .subscribe(() => {
        this.dimensionsSubject.next(this.calculateDimensions());
      });
  }
  private calculateDimensions(): EditorComponentsDimensions {


    const editorWidth = window.innerWidth;
    const editorHeight = window.innerHeight*0.9045;
    const menuHeight = 60;
    const inspectorWidth = 250;
    const toolsWidth = menuHeight;

    const canvasWidth = editorWidth - (inspectorWidth+toolsWidth);
    const canvasHeight = editorHeight*0.75;
    const canvasDimensions: Dimensions = {width: canvasWidth, height: canvasHeight};

    const menuWidth = canvasWidth;
    const menuDimensions: Dimensions = {width: menuWidth, height: menuHeight};

    const inspectorHeight = canvasHeight + menuHeight;
    const inspectorDimensions: Dimensions = {width: inspectorWidth, height: inspectorHeight};


    const toolsHeight = inspectorHeight;
    const toolsDimensions: Dimensions = {width: toolsWidth, height: toolsHeight};

    const previewWidth = editorWidth;
    const previewHeight = editorHeight-canvasHeight-menuHeight;
    const previewDimensions:Dimensions = {width: previewWidth, height: previewHeight};

    return {
      menuDimensions: menuDimensions,
      inspectorDimensions: inspectorDimensions,
      canvasDimensions: canvasDimensions,
      toolsDimensions: toolsDimensions,
      previewDimensions: previewDimensions,
    };
  }
}
