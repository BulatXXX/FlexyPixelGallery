import {Component} from '@angular/core';
import {NgForOf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-home-screen',
  imports: [
    NgStyle,
    NgForOf
  ],
  templateUrl: './home-screen.component.html',
  standalone: true,
  styleUrl: './home-screen.component.css'
})
export class HomeScreenComponent {
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
}


