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

    //TODO:Paddings

    const editorWidth = window.innerWidth*0.95;
    const editorHeight = window.innerHeight * 0.9;
    const menuHeight = 60;
    const inspectorWidth = 300;

    const canvasWidth = editorWidth - inspectorWidth;
    const canvasHeight = editorHeight*0.8;
    const canvasDimensions: Dimensions = {width: canvasWidth, height: canvasHeight};


    const menuWidth = canvasWidth;
    const menuDimensions: Dimensions = {width: menuWidth, height: menuHeight};

    const inspectorHeight = canvasHeight + menuHeight;
    const inspectorDimensions: Dimensions = {width: inspectorWidth, height: inspectorHeight};

    return {
      menuDimensions: menuDimensions,
      inspectorDimensions: inspectorDimensions,
      canvasDimensions: canvasDimensions
    };
  }
}
