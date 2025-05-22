import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {ConfigurationCardService} from '../configuration-card.service';
import {UserService} from '../../../features/profile/UserService';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-configuration-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatMenu, MatMenuItem, MatMenuTrigger, MatSlideToggle, FormsModule],
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
              private userService: UserService,
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

  updateUseMiniPreview(useMini: boolean) {
    this.config.useMiniPreview = useMini;
    this.configurationCardService.updateUseMiniPreview(
      this.config.publicId,
      this.config.name,
      this.config.description,
      this.config.useMiniPreview,
    )
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
          this.userService.loadUserProfile();
          console.log('Удалено');
        },
        error: err => {
          console.error('Не удалось удалить:', err);
        }
      });
  }

  protected readonly console = console;
}
