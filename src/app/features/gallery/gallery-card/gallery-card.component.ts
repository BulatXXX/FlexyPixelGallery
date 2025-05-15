import {Component, inject, Input} from '@angular/core';
import {GalleryItem} from '../gallery-configuration.repository';
import {Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {DatePipe, DecimalPipe} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {GalleryService} from '../gallery.service';
import {SettingsService} from '../../editor/service/SettingsService';
import {Mode} from '../../editor/models/Mode';

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

  constructor(private router: Router, private settingsService: SettingsService) {
  }


  subscribe(publicId: string) {
    this.service.subscribe(publicId).subscribe({
      next: res => {
        // например, показать уведомление об успехе
        console.log("Subscribed")
      },
      error: err => {

      }
    })
  }

  openConfiguration() {
    // this.router.navigate(['/editor', this.item.publicId]).then(r => {
    // });
  }
}
