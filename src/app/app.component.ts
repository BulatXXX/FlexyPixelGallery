import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './ui/components/header/header.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {AsyncPipe, NgIf} from '@angular/common';
import {LoadingService} from './services/LoadingService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MatProgressSpinner, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(protected loadingService: LoadingService) {
  }
  title = 'FlexyPixelGallery';
}
