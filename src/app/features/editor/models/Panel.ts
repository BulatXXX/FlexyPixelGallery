export interface Panel {
  id: string;
  x: number; // координаты левого верхнего угла на "сетки"
  y: number; // (в координатах ячеек, а не пикселей экрана)
  width: number;  // 8
  height: number; // 8

  pixels: string[][];
}
