import {Component} from '@angular/core';
import {NgForOf, NgStyle} from '@angular/common';
import {LoadingService} from '../../../core/services/LoadingService';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-home-screen',
  imports: [
    NgStyle,
    NgForOf,
    TranslatePipe
  ],
  templateUrl: './home-screen.component.html',
  standalone: true,
  styleUrl: './home-screen.component.css'
})
export class HomeScreenComponent {

  constructor(private loadingService: LoadingService) {
  }
  gridItems = [
    ["#F4D58D","#F4D58D","#8D0801","#8D0801","#8D0801","#8D0801","#F4D58D","#F4D58D"],
    ["#F4D58D","#D9D9D9","#8D0801","#8D0801","#8D0801","#8D0801","#D9D9D9","#F4D58D"],
    ["#8D0801","#F4D58D","#F4D58D","#F4D58D","#F4D58D","#F4D58D","#F4D58D","#8D0801"],
    ["#8D0801","#F4D58D","#001427","#F4D58D","#F4D58D","#001427","#F4D58D","#8D0801"],
    ["#8D0801","#F4D58D","#001427","#F4D58D","#F4D58D","#001427","#F4D58D","#8D0801"],
    ["#8D0801","#F4D58D","#D9D9D9","#BF0603","#BF0603","#D9D9D9","#F4D58D","#8D0801"],
    ["#D9D9D9","#F4D58D","#D9D9D9","#D9D9D9","#D9D9D9","#D9D9D9","#F4D58D","#8D0801"],
    ["#D9D9D9","#D9D9D9","#8D0801","#8D0801","#8D0801","#8D0801","#D9D9D9","#D9D9D9"],
  ];

  load() {
    this.loadingService.show()
  }
}


