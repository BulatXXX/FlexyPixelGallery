// src/app/gallery/services/gallery.service.ts
import {Injectable, signal, computed, effect, inject} from '@angular/core';
import {catchError, debounceTime, switchMap, tap} from 'rxjs/operators';

import {from, of, throwError} from 'rxjs';
import {
  GalleryConfigurationRepository,
  GalleryItem,
  SearchRequest
} from '../configurations/gallery-configuration.repository';
import {LoadingService} from '../../core/services/LoadingService';

@Injectable({providedIn: 'root'})
export class GalleryService {
  private repo = inject(GalleryConfigurationRepository);
  private loadingService = inject(LoadingService);

  // фильтры
  searchQuery = signal<string>('');
  tagFilterIds = signal<string[]>([]);
  ratingRange = signal<{ from: null | number; to: null | number }>({from: null, to: null});
  sortBy = signal<{ [k: string]: { order: 'ASC' | 'DESC' } }>({'AddedCount': {order: 'DESC'}});

  // страница
  offset = signal(0);
  size = signal(20);

  // результаты
  results = signal<GalleryItem[]>([]);
  loading = signal(false);

  subscribe(publicId: string) {
    return this.repo.subscribeConfiguration(publicId).pipe(
      tap(res => console.log('Subscribed, response:', res)),
      catchError(err => {
        console.error('Subscribe failed', err);
        return throwError(() => err);
      })
    )
  }

  constructor() {
    // следим за изменениями и перезапрашиваем
    effect(() => {
      const req: SearchRequest = {
        searchQuery: this.searchQuery(),
        tagFilterIds: this.tagFilterIds(),
        tagMatchMode: 'ANY',
        publishedAtRange: null,
        ratingRange: this.ratingRange(),
        addedCountRange: {from: null, to: null},
        sortBy: this.sortBy(),
        offset: this.offset(),
        size: this.size()
      };

      from(of(req))
        .pipe(
          debounceTime(1000),
          tap(() => {
            this.loading.set(true)
            this.loadingService.show();
          }),
          switchMap(r => this.repo.search(r)),
          tap(data => {
            this.results.set(data);
            this.loading.set(false);
            this.loadingService.hide();
          })
        )
        .subscribe();
    });
  }
}

