import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuOpen = false;


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
