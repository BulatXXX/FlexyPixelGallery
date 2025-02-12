import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-toolbar-header',
  imports: [
    MatToolbar,
    MatIcon,
    RouterLink,
    MatIconButton,
    NgClass
  ],
  templateUrl: './toolbar-header.component.html',
  standalone: true,
  styleUrl: './toolbar-header.component.css'
})
export class ToolbarHeaderComponent {
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
