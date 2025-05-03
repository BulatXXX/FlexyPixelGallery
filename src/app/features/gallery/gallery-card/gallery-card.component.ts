import {Component, inject, Input} from '@angular/core';
import {GalleryItem} from '../../configurations/gallery-configuration.repository';
import {RouterLink} from '@angular/router';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardModule
} from '@angular/material/card';
import {DatePipe, DecimalPipe, NgForOf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {config} from 'rxjs';
import {GalleryService} from '../gallery.service';

@Component({
  selector: 'app-gallery-card',
  imports: [
    MatCardModule,
    MatIcon,
    MatIconButton,
    DecimalPipe,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    DatePipe
  ],
  templateUrl: './gallery-card.component.html',
  standalone: true,
  styleUrl: './gallery-card.component.css'
})
export class GalleryCardComponent {
  @Input() item!: GalleryItem;

  private service: GalleryService = inject(GalleryService);

  subscribe(publicId: string){
    this.service.subscribe(publicId).subscribe({
      next: res => {
        // например, показать уведомление об успехе
        console.log("Subscribed")
      },
      error: err => {

      }
    })
  }
}
