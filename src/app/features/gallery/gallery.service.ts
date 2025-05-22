import {Injectable, signal, effect, inject} from '@angular/core';
import {catchError, debounceTime, switchMap, tap} from 'rxjs/operators';

import {finalize, from, of, throwError} from 'rxjs';
import {
  GalleryConfigurationRepository,
  GalleryItem,
  SearchRequest
} from './gallery-configuration.repository';
import {LoadingService} from '../../core/services/LoadingService';

@Injectable({providedIn: 'root'})
export class GalleryService {
  private repo = inject(GalleryConfigurationRepository);
  private loadingService = inject(LoadingService);

  // фильтры
  searchQuery = signal<string>('');
  tagFilterIds = signal<string[]>([]);

  ratingRange = signal<{ from: null | number; to: null | number }>({from: null, to: null});
  addedCountRange = signal<{ from: number | null; to: number | null }>({from: null, to: null});
  publishedAtRange = signal<{ from: Date | null; to: Date | null }>({from: null, to: null});

  sortBy = signal<{ type: SortType; order: 'ASC' | 'DESC' }>({
    type: 'AddedCount',
    order: 'DESC'
  });

  offset = signal(0);
  size = signal(20);

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

  public updateFilters() {

  }

  constructor() {

    effect(() => {
      const publishedRange = this.publishedAtRange();
      const publishedAtRangeFormatted = (publishedRange.from && publishedRange.to)
        ? {
          from: publishedRange.from.toISOString(),
          to: publishedRange.to.toISOString()
        }
        : null;
      const req: SearchRequest = {
        searchQuery: this.searchQuery(),
        tagFilterIds: this.tagFilterIds(),
        tagMatchMode: 'ANY',
        publishedAtRange: publishedAtRangeFormatted,
        ratingRange: this.ratingRange(),
        addedCountRange: this.addedCountRange(),
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
            console.log(
              'Received items publishedAt:',
              data.map(item => item.publishedAt)
            );
          }),
          tap(data => {
            this.results.set(data);
            this.loading.set(false);
            this.loadingService.hide();
          })
        )
        .subscribe();
    });
  }

  banConfig(publicId: string) {
    this.loadingService.show();
    return this.repo.banConfig(publicId)
      .pipe(
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          if (res.message && res.message.length > 0) {
            this.results.update(items =>
              items.filter(item => item.publicId !== publicId)
            );
          }
        }
      })
  }
}

export type SortType = 'PublishedAt' | 'AverageRating' | 'AddedCount';
