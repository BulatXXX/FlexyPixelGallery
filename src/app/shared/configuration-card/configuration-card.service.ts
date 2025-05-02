// src/app/configuration/services/configuration-card.service.ts

import {Injectable, inject} from '@angular/core';
import {finalize, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LoadingService} from '../../core/services/LoadingService';
import {LibraryConfigurationRepository} from '../../features/configurations/library-configuration.repository';
import {GalleryConfigurationRepository} from '../../features/configurations/gallery-configuration.repository';


@Injectable({providedIn: 'root'})
export class ConfigurationCardService {
  private libraryConfigurationRepository = inject(LibraryConfigurationRepository);
  private galleryConfigurationRepository = inject(GalleryConfigurationRepository);
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
        // логика после удаления, например:
        console.log(`Configuration ${publicId} deleted`);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}
