import {Component, inject, Input} from '@angular/core';
import {GalleryItem} from '../gallery-configuration.repository';
import {Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {AsyncPipe, DatePipe, DecimalPipe, NgIf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {GalleryService} from '../gallery.service';
import {SettingsService} from '../../editor/service/SettingsService';
import {Mode} from '../../editor/models/Mode';
import {UserService} from '../../profile/UserService';
import {AuthService} from '../../auth/services/AuthService';

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
    DatePipe,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './gallery-card.component.html',
  standalone: true,
  styleUrl: './gallery-card.component.css'
})
export class GalleryCardComponent {
  @Input() item!: GalleryItem;

  private service: GalleryService = inject(GalleryService);
  private userService = inject(UserService);
  protected authService = inject(AuthService);


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


  banConfig() {
    const res = this.service.banConfig(this.item.publicId)
  }
}
