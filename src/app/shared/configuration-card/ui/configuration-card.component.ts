import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {ConfigurationService} from '../../../features/editor/service/ConfigurationService';
import {ConfigurationCardService} from '../configuration-card.service';
import {config} from 'rxjs';

@Component({
  selector: 'app-configuration-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatMenu, MatMenuItem, MatMenuTrigger],
  templateUrl: './configuration-card.component.html',
  styleUrls: ['./configuration-card.component.css']
})
export class ConfigurationCardComponent {


  @Input() config!: {
    publicId: string;
    name: string;
    description: string;
    previewImageUrl: string | null;
    miniPreviewImageUrl: string | null;
    miniPreviewPanelUid: string | null;
    useMiniPreview: boolean;
    createdAt: string;
    updatedAt: string;
    forkStatus: 'ORIGINAL' | 'ADDED' | 'MODIFIED';
    forkInfo: any | null;
    isPublic?: boolean;
  };

  constructor(private router: Router,
              private configurationCardService: ConfigurationCardService,
  ) {
  }

  previewError = false;
  @Input() isOwnProfile: boolean = false;

  onImageError() {
    this.previewError = true;               // при ошибке ставим флаг
  }

  getPreviewUrl(config: any): string | null {
    if (config.useMiniPreview) {
      return config.miniPreviewImageUrl || config.previewImageUrl || null;
    } else {
      return config.previewImageUrl || config.miniPreviewImageUrl || null;
    }
  }


  edit(publicId: string) {
    this.router.navigate(['/editor', publicId]).then(r => {
    });
  }

  view(publicId: string) {
    this.router.navigate(['/configurations', publicId]).then(r => {
    });
  }

  publish(publicId: string) {
    this.configurationCardService
      .publishConfiguration(publicId, this.config.name, this.config.description)
      .subscribe({
        next: resp => {

        },
        error: err => {
          // обработка ошибки
          console.error('Не удалось опубликовать:', err);
        }
      });
  }

  unpublish(publicId: string) {

  }

  viewOnGallery(publicId: string) {

  }

  gotoOriginal(publicId: string) {

  }

  fork(publicId: string) {

  }


  delete(publicId: string) {
    this.configurationCardService
      .deleteConfiguration(publicId)
      .subscribe({
        next: () => {
          // например, эмитнуть событие или удалить карточку из списка
          console.log('Удалено');
        },
        error: err => {
          console.error('Не удалось удалить:', err);
        }
      });
  }
}
