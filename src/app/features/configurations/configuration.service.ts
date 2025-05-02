import { Injectable, inject, signal } from '@angular/core';

import {switchMap, tap} from 'rxjs';
import {ConfigurationRepository} from './configuration.repository';
import {LoadingService} from '../../core/services/LoadingService';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private repo = inject(ConfigurationRepository);
  private loadingService = inject(LoadingService);

  config = signal<any | null>(null);
  loading = signal(false);


  load(publicId: string) {
    this.loading.set(true);
    this.repo.getById(publicId).pipe(
      tap(() => this.loading.set(false))
    ).subscribe(conf => this.config.set(conf));
  }

  /** Сохраняет изменения name/description/useMiniPreview */
  save() {
    const curr = this.config();
    if (!curr) return;
    this.loading.set(true);
    this.loadingService.show()

    this.repo.update(curr.publicId, {
      name: curr.name,
      description: curr.description,
      useMiniPreview: curr.useMiniPreview
    }).pipe(
      switchMap(() => this.repo.getById(curr.publicId)),  // сразу новый full-load
      tap(full => {
        this.config.set(full);
        this.loading.set(false);
        this.loadingService.hide();
      })
    ).subscribe();
  }

}
