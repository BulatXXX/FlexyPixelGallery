// src/app/services/image-attaching.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, Observable, take} from 'rxjs';
import {PanelStateService} from './PanelStateService';

import {Command, CommandManager} from './CommandManager';
import {AnimationService} from './AnimationService';
import {LoadingService} from '../../../core/services/LoadingService';

/** Варианты вписывания картинки в выделенную область */
// ДОБАВЬ gx, gy и допусти 'hole'
export interface PixelAddress {
  gx: number;
  gy: number;                // глобальные координаты на сетке
  panelIdx: number | 'hole';             // 'hole' если панели под ячейкой нет
  x?: number;
  y?: number;                // localX/Y внутри панели (если есть)
}


export type Coverage = 'cover' | 'fit';

/** Целевые кадры, на которые накладывается изображение */
export type Target = 'current' | 'all' | 'selected';

export interface ImageAttachingOptions {
  coverage: Coverage;
  target: Target;
  selectedFrames?: number[];
}

export interface SelectionRect {
  startX: number; // панель‑грид X
  startY: number;
  endX: number;   // включительно
  endY: number;
}

@Injectable({providedIn: 'root'})
export class ImageAttachingService {
  selectionSub = new BehaviorSubject<SelectionRect | null>(null);
  selection$: Observable<SelectionRect | null> = this.selectionSub.asObservable();

  /** activeHandle хранит id угловой точки, если идёт ресайз */
  private activeHandle: 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r' | 'inside' | null = null;
  private dragAnchor: { gx: number; gy: number } | null = null;
  private dragStartRect: SelectionRect | null = null;

  private previewUrlSub = new BehaviorSubject<string | null>(null);
  previewUrl$ = this.previewUrlSub.asObservable();

  private bitmaps: ImageBitmap[] = [];        // 1 шт. для png/jpg, ≥1 для gif
  private opts: ImageAttachingOptions = {coverage: 'cover', target: 'all'};


  constructor(private panelState: PanelStateService,
              private animation: AnimationService,
              private commandManager: CommandManager,
              private loadingService: LoadingService,
  ) {
    // Авто‑инициализация: если панелей нет, то (0,0), иначе первая панель
    this.panelState.panels$
      .pipe(filter(p => p.length > 0), take(1))
      .subscribe(panels => {
        if (!this.selectionSub.value) {
          const p = panels[0];
          // Выберем 1‑ю ячейку (0,0) внутри первой панели
          this.selectionSub.next({startX: p.x, startY: p.y, endX: p.x, endY: p.y});
        }
      });
  }

  /** Начало нового выделения */
  beginSelection(gridX: number, gridY: number): void {
    this.activeHandle = 'br'; // будем тянуть правый‑нижний угол
    const sel: SelectionRect = {startX: gridX, startY: gridY, endX: gridX, endY: gridY};
    this.selectionSub.next(sel);
  }

  startDrag(gx: number, gy: number): void {
    if (!this.selectionSub.value) {
      return;
    }
    this.activeHandle = 'inside';
    this.dragAnchor = {gx, gy};
    this.dragStartRect = {...this.selectionSub.value};
  }

  /** Обновление прямоугольника при ресайзе всей области (drag за тело) */
  updateDrag(gx: number, gy: number): void {
    if (this.activeHandle !== 'inside' || !this.dragAnchor || !this.dragStartRect) {
      return;
    }
    const dx = gx - this.dragAnchor.gx;
    const dy = gy - this.dragAnchor.gy;
    const {startX, startY, endX, endY} = this.dragStartRect;
    const sel: SelectionRect = {
      startX: startX + dx,
      startY: startY + dy,
      endX: endX + dx,
      endY: endY + dy
    };
    this.selectionSub.next(sel);
  }


  /** Установить, какой угол тянем (из mouse‑down на handle) */
  startHandleResize(handle: 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r'): void {
    this.activeHandle = handle;
  }


  /** Ресайз прямоугольника по выбранному углу */
  updateHandleResize(gridX: number, gridY: number): void {
    if (!this.activeHandle) {
      return;
    }
    const sel = this.selectionSub.value;
    if (!sel) {
      return;
    }
    let {startX, startY, endX, endY} = sel;
    switch (this.activeHandle) {
      case 'tl':
        startX = gridX;
        startY = gridY;
        break;
      case 'tr':
        endX = gridX;
        startY = gridY;
        break;
      case 'bl':
        startX = gridX;
        endY = gridY;
        break;
      case 'br':
        endX = gridX;
        endY = gridY;
        break;
      case 't':
        startY = gridY;
        break;
      case 'b':
        endY = gridY;
        break;
      case 'l':
        startX = gridX;
        break;
      case 'r':
        endX = gridX;
        break;
    }
    this.selectionSub.next({startX, startY, endX, endY});
  }

  endInteraction(): void {
    this.activeHandle = null;
    this.dragAnchor = null;
    this.dragStartRect = null;
  }

  private buildSelectedPixelMap(): { map: PixelAddress[]; width: number; height: number } {
    const sel = this.selectionSub.value!;
    const minX = Math.min(sel.startX, sel.endX);
    const minY = Math.min(sel.startY, sel.endY);
    const maxX = Math.max(sel.startX, sel.endX);
    const maxY = Math.max(sel.startY, sel.endY);

    const panels = this.panelState.panels;
    const map: PixelAddress[] = [];

    for (let gy = minY; gy <= maxY; gy++) {
      for (let gx = minX; gx <= maxX; gx++) {
        const pIdx = panels.findIndex(p => gx >= p.x && gx < p.x + 8 && gy >= p.y && gy < p.y + 8);
        if (pIdx === -1) {
          map.push({gx, gy, panelIdx: 'hole'});           // «дырка»
        } else {
          const p = panels[pIdx];
          map.push({gx, gy, panelIdx: pIdx, x: gx - p.x, y: gy - p.y});
        }
      }
    }
    return {map, width: maxX - minX + 1, height: maxY - minY + 1};
  }


  public getSelectedPixelMap() {
    return this.buildSelectedPixelMap();
  }

  async loadFile(file: File): Promise<void> {
    this.loadingService.show()
    const url = URL.createObjectURL(file);
    this.previewUrlSub.next(url);

    if (file.type === 'image/gif') {
      const mod = await import('gifuct-js');
      const {parseGIF, decompressFrames} = (mod as any).default ?? mod;

      const buffer = await file.arrayBuffer();
      const parsed = parseGIF(buffer);
      // собираем патчи
      const frames = decompressFrames(parsed, true);

      // размеры всего холста анимации
      const gifWidth = parsed.lsd.width;
      const gifHeight = parsed.lsd.height;

      // единый OffscreenCanvas для композиции всех патчей
      const off = new OffscreenCanvas(gifWidth, gifHeight);
      const ctx = off.getContext('2d')!;

      const bitmaps: ImageBitmap[] = [];
      // буфер для «restore to previous» (disposalType 3)
      let prevCanvasData: ImageData | null = null;

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const {dims, patch, disposalType} = frame;

        // 1) сначала обрабатываем утилизацию предыдущего кадра
        if (i > 0) {
          const prev = frames[i - 1];
          switch (prev.disposalType) {
            case 2: // restore to background color → очищаем прямоугольник
              ctx.clearRect(
                prev.dims.left,
                prev.dims.top,
                prev.dims.width,
                prev.dims.height
              );
              break;
            case 3: // restore to previous → откатываемся к сохранённому ImageData
              if (prevCanvasData) {
                ctx.putImageData(prevCanvasData, 0, 0);
              }
              break;
            // case 0,1: не трогаем (draw over)
          }
        }

        // 2) если текущий фрейм заявляет disposalType=3, сохраняем snapshot
        if (disposalType === 3) {
          prevCanvasData = ctx.getImageData(0, 0, gifWidth, gifHeight);
        }

        // 3) рисуем текущий патч в нужной позиции
        ctx.putImageData(
          new ImageData(patch, dims.width, dims.height),
          dims.left,
          dims.top
        );

        // 4) сохраняем «полный» кадр
        bitmaps.push(
          await createImageBitmap(off)
        );

      }

      this.bitmaps = bitmaps;
      this.loadingService.hide()
    } else {
      this.bitmaps = [await createImageBitmap(file)];
      this.loadingService.hide()
    }
  }

  async apply(): Promise<void> {
    const {map, width, height} = this.buildSelectedPixelMap();
    if (!map.length || !this.bitmaps.length) {
      return;
    }

    // 1) пикселизуем каждый bmp:
    const rawColorsPerFrame = await Promise.all(
      this.bitmaps.map(bmp => this.pixelizeBitmap(bmp, width, height))
    );

    // 2) «заливаем» прозрачные пиксели из предыдущего кадра:
    const colorsPerFrame: string[][] = [];
    rawColorsPerFrame.forEach((colors, idx) => {
      if (idx === 0) {
        colorsPerFrame.push(colors);
      } else {
        const prev = colorsPerFrame[idx - 1];
        colorsPerFrame.push(
          colors.map((c, i) => c === '#00000000' ? prev[i] : c)
        );
      }
    });

    // 3) кадры-назначения
    const targetFrames = this.resolveTargetFrames(colorsPerFrame.length);

    // 4) строим и выполняем команду
    const cmd = this.buildOverlayCommand(map, colorsPerFrame, targetFrames, width);
    this.commandManager.execute(cmd);
  }

  private async pixelizeBitmap(bmp: ImageBitmap, w: number, h: number): Promise<string[]> {
    const off = new OffscreenCanvas(w, h);
    const ctx = off.getContext('2d')!;
    // cover/fit
    if (this.opts.coverage === 'cover') {
      const scale = Math.max(w / bmp.width, h / bmp.height);
      const dw = bmp.width * scale, dh = bmp.height * scale;
      ctx.drawImage(bmp, (w - dw) / 2, (h - dh) / 2, dw, dh);
    } else {
      const scale = Math.min(w / bmp.width, h / bmp.height);
      const dw = bmp.width * scale, dh = bmp.height * scale;
      ctx.drawImage(bmp, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }
    const {data} = ctx.getImageData(0, 0, w, h);
    const colors: string[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = data.slice(i, i + 4);
      colors.push(a === 0 ? '#00000000' : `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
    }
    const nonZero = data.reduce((cnt, v, i) => (i % 4 === 3 && v > 0 ? cnt + 1 : cnt), 0);
    console.log('pixelizeBitmap: непрозрачных пикселей =', nonZero);
    return colors;      // length = w*h
  }


  private resolveTargetFrames(gifLen: number): number[] {
    const total = this.animation.frames.length;
    switch (this.opts.target) {
      case 'all':
        return [...Array(total).keys()];
      case 'selected':
        return this.opts.selectedFrames ?? [this.animation.currentFrameIndex];
      default:
        return [this.animation.currentFrameIndex];
    }
  }

  private buildOverlayCommand(
    map: PixelAddress[],
    colorsPerFrame: string[][],
    frames: number[],
    width: number
  ): Command {

    const before = new Map<string, string>();
    const after = new Map<string, string>();

    frames.forEach((fIdx, fi) => {
      const frameColors = colorsPerFrame[fi % colorsPerFrame.length];
      map.forEach((addr, idx) => {
        if (addr.panelIdx === 'hole') {
          return;
        }               // пропускаем пустые
        const color = frameColors[idx];                         // idx = y*width + x
        if (color === '#00000000') {
          return;
        }                  // прозрачный — не трогаем

        const key = `${fIdx}:${addr.panelIdx}:${addr.x}:${addr.y}`;
        const prev = this.animation.getPixelColor(fIdx, addr.panelIdx, addr.x!, addr.y!);
        before.set(key, prev);
        after.set(key, color);
      });
    });

    return {
      do: () => after.forEach((c, k) => {
        const [f, p, x, y] = k.split(':').map(Number);
        this.animation.setPixelColor(f, p, x, y, c);
      }),
      undo: () => before.forEach((c, k) => {
        const [f, p, x, y] = k.split(':').map(Number);
        this.animation.setPixelColor(f, p, x, y, c);
      })
    };
  }

  setOptions(options: Partial<ImageAttachingOptions>): void {
    this.opts = {...this.opts, ...options};
  }


}
