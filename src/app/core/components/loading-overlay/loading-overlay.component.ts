import { Component } from '@angular/core';
import {LoadingService} from '../../services/LoadingService';
import {Observable} from 'rxjs';
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-loading-overlay',
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './loading-overlay.component.html',
  standalone: true,
  styleUrl: './loading-overlay.component.css'
})
export class LoadingOverlayComponent {
  loading$: Observable<boolean>;
  constructor(loadingService: LoadingService) {
    this.loading$ = loadingService.loading$;
  }

}
