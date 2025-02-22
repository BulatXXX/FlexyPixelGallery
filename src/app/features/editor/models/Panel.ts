export interface Panel {
  id: string;
  x: number; // координата по горизонтали (ячейка сетки)
  y: number; // координата по вертикали (ячейка сетки)
  direction: 'L' | 'R' | 'T' | 'B'; // новое поле направления
  pixels: string[][]; // 8×8, например, hex-коды цветов
}
