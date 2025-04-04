import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-firmware-screen',
  imports: [
    NgStyle,
    NgForOf,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    NgIf
  ],
  templateUrl: './firmware-screen.component.html',
  standalone: true,
  styleUrl: './firmware-screen.component.css'
})
export class FirmwareScreenComponent {
  colors: string[] = ['#FF5733', '#33FF57', '#3357FF'];

  get colorsForDisplay(): (string | null)[] {
    return [...this.colors, null];
  }

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  // Получаем доступ к контейнеру через @ViewChild
  @ViewChild('container') container!: ElementRef;
  @ViewChild('add') addRect!: ElementRef;


  // Метод добавления нового элемента и прокрутки списка вниз
  addColor(): void {
    console.log("Ok");
    for (let i = 0; i < 100; i++) {
      this.colors.push(this.getRandomColor());
    }


    // Ждем, чтобы Angular обновил представление, затем прокручиваем список
    setTimeout(() => {
      if (this.viewport)
        this.viewport.scrollToIndex(this.colors.length);
    }, 20);

  }

  // Прокрутка контейнера до самого низа
  scrollToBottom(): void {
    if (this.container && this.container.nativeElement) {
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    }
  }

  // Генерация случайного цвета в формате HEX
  getRandomColor(): string {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
