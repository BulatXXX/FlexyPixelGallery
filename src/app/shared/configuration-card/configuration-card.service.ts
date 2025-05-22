// src/app/configuration/services/configuration-card.service.ts

import {Injectable, inject} from '@angular/core';
import {finalize, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LoadingService} from '../../core/services/LoadingService';
import {LibraryConfigurationRepository} from '../../features/configurations/library-configuration.repository';
import {GalleryConfigurationRepository} from '../../features/gallery/gallery-configuration.repository';
import {NotificationService} from '../../core/services/NotificationService';
import {UserService} from '../../features/profile/UserService';


@Injectable({providedIn: 'root'})
export class ConfigurationCardService {
  private userService: UserService = inject(UserService);

  private libraryConfigurationRepository = inject(LibraryConfigurationRepository);
  private galleryConfigurationRepository = inject(GalleryConfigurationRepository);
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService)


  /**
   * Публикует конфигурацию в галерею.
   * @param publicId идентификатор конфигурации
   * @param newName
   * @param newDescription
   * @returns обновлённый объект Configuration
   */
  publishConfiguration(publicId: string, newName: string, newDescription: string): Observable<any> {
    this.loadingService.show()
    return this.galleryConfigurationRepository.publishConfiguration(publicId, newName, newDescription).pipe(
      tap(updated => {
        console.log(`Configuration ${publicId} published`, updated);
      }),
      finalize(() => {
        this.userService.loadUserProfile();
        this.notificationService.showSuccess(`Configuration ${newName} published`);
        this.loadingService.hide();
      })
    );
  }

  /**
   * Удаляет конфигурацию.
   * @param publicId идентификатор конфигурации
   * @returns пустой ответ или статус
   */
  deleteConfiguration(publicId: string): Observable<void> {
    this.loadingService.show()
    return this.libraryConfigurationRepository.deleteConfiguration(publicId).pipe(
      tap(() => {

        console.log(`Configuration ${publicId} deleted`);
      }),
      finalize(() => {
        this.userService.loadUserProfile();
        this.notificationService.showSuccess(`Configuration deleted`);
        this.loadingService.hide();
      })
    );
  }

  updateUseMiniPreview(publicId: string, name: string, description: string, useMini: boolean) {
    return this.libraryConfigurationRepository.updateConfigurationData(publicId, {
      name: name,
      description: description,
      useMiniPreview: useMini
    }).subscribe(
      {
        next: () => console.log('ok'),
        error: err => {
        }
      }
    )
  }


}
