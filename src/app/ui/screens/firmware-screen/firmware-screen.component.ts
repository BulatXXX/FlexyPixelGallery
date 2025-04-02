import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgForOf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-firmware-screen',
  imports: [
    NgStyle,
    NgForOf
  ],
  templateUrl: './firmware-screen.component.html',
  standalone: true,
  styleUrl: './firmware-screen.component.css'
})
export class FirmwareScreenComponent {
  colors: string[] = ['#FF5733', '#33FF57', '#3357FF'];

  // Получаем доступ к контейнеру через @ViewChild
  @ViewChild('container') container!: ElementRef;
  @ViewChild('add') addRect!: ElementRef;



  // Метод добавления нового элемента и прокрутки списка вниз
  addColor(): void {
    this.colors.push(this.getRandomColor());
    // Ждем, чтобы Angular обновил представление, затем прокручиваем список
    setTimeout(() => this.scrollToBottom(), 0);

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
