import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './ui/components/header/header.component';
import {LoadingOverlayComponent} from './core/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() {
  }
  title = 'FlexyPixelGallery';
}
