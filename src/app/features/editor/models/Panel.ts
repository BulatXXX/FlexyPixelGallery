export interface Panel {
  id: string;
  x: number; // координата по горизонтали (ячейка сетки)
  y: number; // координата по вертикали (ячейка сетки)
  direction: Direction; // новое поле направления
  pixels: string[][]; // 8×8, например, hex-коды цветов
}

export enum Direction {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom'
}
