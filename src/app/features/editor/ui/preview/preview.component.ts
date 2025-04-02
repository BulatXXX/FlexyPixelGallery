import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {AnimationService} from '../../service/AnimationService';
import {Frame} from '../../models/Frame';
import {MatIcon} from '@angular/material/icon';
import {PanelStateService} from '../../service/PanelStateService';
import {Panel} from '../../models/Panel';

@Component({
  selector: 'app-preview',
  standalone: true,
  templateUrl: './preview.component.html',
  imports: [
    NgStyle,
    NgClass,
    MatIcon,
    NgForOf,
    NgIf
  ],
  styleUrl: './preview.component.css'
})
export class PreviewComponent implements OnChanges, OnInit {
  @Input() width: number = 100;
  @Input() height: number = 100;
  frames: Frame[] = [];
  currentFrameIndex: number = 0;
  panels: Panel[] = [];

  previewListItemSize = 10;

  panelPreviewSize: number = 5;

  offsetX: number = 0;
  offsetY: number = 0;

  usedWidth: number = 0;
  usedHeight: number = 0;


  @ViewChild('previewList') previewList!: ElementRef;

  constructor(protected animationService: AnimationService, protected panelStateService: PanelStateService) {

  }


  ngOnChanges(changes: SimpleChanges): void {
    this.updateSizes()
  }


  ngOnInit() {
    this.updateSizes()
    this.animationService.frames$.subscribe(frames => {
      this.frames = frames;
    })
    this.animationService.currentFrameIndex$.subscribe(currentFrameIndex => {
      this.currentFrameIndex = currentFrameIndex;
    })

    this.panelStateService.panels$.subscribe(panels => {
      this.panels = panels;
      this.computePanelPreviewDimensions();
    });
  }

  private updateSizes() {
    this.previewListItemSize = this.height*0.6
    this.computePanelPreviewDimensions()
  }

  computePanelPreviewDimensions(): void {
    if (!this.panels.length) {
      this.panelPreviewSize = 0;

      this.offsetX = 0;
      this.offsetY = 0;
      return;
    }
    const PANEL_SIZE = 8; // размер панели в клетках

    // Вычисляем минимальные и максимальные координаты (предполагаем, что panel.x и panel.y кратны PANEL_SIZE)
    const minX = Math.min(...this.panels.map(p => p.x));
    const minY = Math.min(...this.panels.map(p => p.y));
    const maxX = Math.max(...this.panels.map(p => p.x));
    const maxY = Math.max(...this.panels.map(p => p.y));

    // Количество панелей по горизонтали и вертикали
    const totalColumns = ((maxX - minX) / PANEL_SIZE) + 1;
    const totalRows = ((maxY - minY) / PANEL_SIZE) + 1;

    // Берем максимум, чтобы панели были квадратными и умещались в превью
    const maxPanelsFromOneSide = Math.max(totalColumns, totalRows);

    // Вычисляем размер одной миниатюрной панели

    this.panelPreviewSize = this.previewListItemSize / maxPanelsFromOneSide;

    this.usedWidth = totalColumns * this.panelPreviewSize;
    this.usedHeight = totalRows * this.panelPreviewSize;

    this.offsetX = (minX / PANEL_SIZE) * this.panelPreviewSize;
    this.offsetY = (minY / PANEL_SIZE) * this.panelPreviewSize;
    console.log(this.offsetX, this.offsetY)

  }


  selectFrame(index: number): void {
    this.animationService.selectFrame(index);
  }
  addButtonTransform: string = '';
  // addFrame(): void {
  //   // Вызываем метод AnimationService для добавления нового кадра
  //   this.animationService.selectFrame(this.animationService.frames.length);
  //
  //   // Ждем, чтобы DOM обновился, и затем прокручиваем контейнер и запускаем анимацию
  //   setTimeout(() => {
  //     const newFrameElement = document.getElementById('new-frame');
  //     const addElement = document.getElementById('item-add');
  //     if (newFrameElement) {
  //       // Добавляем класс для анимации появления
  //       newFrameElement.classList.add('new');
  //
  //       // Прокручиваем контейнер плавно
  //       if(addElement) {
  //         addElement.scrollIntoView({behavior: 'smooth', inline: 'end',block:"nearest"});
  //
  //         if (this.previewList && this.previewList.nativeElement) {
  //           const container = this.previewList.nativeElement as HTMLElement;
  //           const newOffset = container.scrollWidth - container.clientWidth;
  //           this.addButtonTransform = `translateX(${newOffset}px)`;
  //           setTimeout(()=>{
  //             this.addButtonTransform = `translateX(0px)`;
  //           },1000)
  //
  //         }
  //       }
  //       // Удаляем класс анимации после завершения (например, через 500 мс)
  //       setTimeout(() => {
  //         newFrameElement.classList.remove('new');
  //       }, 500);
  //     }
  //   }, 10);
  // }
  itemsShiftTransform= "";
  addFrame(): void {
    // 1. Добавляем кадр (он будет добавлен справа)
    const container = this.previewList.nativeElement as HTMLElement;
   setTimeout(()=>{

     container.scrollTo({
       left: container.scrollWidth,
       behavior: 'smooth'
     });

   },400)
    this.animationService.selectFrame(this.animationService.frames.length);
    // 2. Делаем паузу, чтобы Angular успел отрисовать DOM
    setTimeout(() => {
      const addElement = document.getElementById('item-add');
      const newFrameElement = document.getElementById('new-frame');

      if (newFrameElement && addElement && this.previewList && this.previewList.nativeElement) {
       // addElement.scrollIntoView({behavior: 'smooth', inline: 'end',block:"nearest"});

        container.style.paddingRight = `${this.previewListItemSize}px`;
        container.style.paddingLeft = `${this.previewListItemSize}px`;
        // 3. Вычисляем смещение вправо
        const scrollOffset = this.previewListItemSize/3;

        // 4. Сдвигаем кнопку "добавить" вправо
        this.addButtonTransform = `translateX(${scrollOffset}px)`;
        this.itemsShiftTransform = `translateX(-${scrollOffset}px)`;
        // 5. Ждём завершения движения, потом возвращаем на место

        setTimeout(() => {
          this.addButtonTransform = `translateX(0px)`;
          this.itemsShiftTransform = `translateX(0px)`;
          setTimeout(()=>{
            container.style.paddingRight = `40px`;
            container.style.paddingLeft = `40px`;
          },400)
        }, 400);
        // должно совпадать с transition в CSS
      }

      // 6. Анимация появления кадра
      if (newFrameElement) {
        newFrameElement.classList.add('new');
        setTimeout(() => {
          newFrameElement.classList.remove('new');
        }, 500);
      }

    }, 10); // небольшая задержка, чтобы DOM успел обновиться
  }



  getItemTransform(index: number): string {
    const isActive = index === this.currentFrameIndex;
    const scale = isActive ? 1.2 : 1;
    const shift = this.itemsShiftTransform || 'translateX(0px)';

    return `${shift} scale(${scale})`;
  }




  getPanelMatrix(frame: Frame, panelId: string): string[][] {
    return frame.panelPixelColors[panelId] || [];
  }


  getPanelTransform(panel: Panel): string {
    let x = (panel.x / 8 * this.panelPreviewSize) - this.offsetX;
    let y = (panel.y / 8 * this.panelPreviewSize) - this.offsetY;
    if (this.usedWidth > this.usedHeight) {
      y += (this.previewListItemSize - this.usedHeight) / 2;
    } else if (this.usedHeight > this.usedWidth) {
      x += (this.previewListItemSize - this.usedWidth) / 2;
    }
    return `translate(${x}, ${y})`;

  }

}
