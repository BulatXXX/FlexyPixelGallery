import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from '@angular/material/datepicker';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';  //
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {GalleryService, SortType} from '../gallery.service';
import {MatSliderModule} from '@angular/material/slider';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {LanguageService} from '../../../core/services/language.service';


export interface SortByOption {
  type:  SortType;
  order: 'ASC' | 'DESC';
}



@Component({
  selector: 'app-filters',
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatDateRangeInput,
    MatDatepickerToggle,
    MatDateRangePicker,
    MatOption,
    MatSelect,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader
  ],
  templateUrl: './filters.component.html',
  standalone: true,
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit {


  constructor(protected galleryService: GalleryService,
              private adapter: DateAdapter<any>,
              private lang: LanguageService) {
    adapter.setLocale(this.lang.currentLocale);
    // и подпишемся на переключение
    this.lang.onLocaleChange$.subscribe(l => {
      this.adapter.setLocale(l);
    });

  }

  ngOnInit(): void {

  }


  reset(): void {
    this.galleryService.tagFilterIds.set([]);
    this.galleryService.ratingRange.set({from: null, to: null});
    this.galleryService.addedCountRange.set({from: null, to: null});
    this.galleryService.publishedAtRange.set({from: null, to: null});
    this.galleryService.sortBy.set({type:'AddedCount', order: 'DESC'});
    this.galleryService.offset.set(0);
    this.galleryService.size.set(20);

  }




  setRatingFrom(value: number) {
    if (value > 5) {
      value = 5;
    }
    if (value < 0) {
      value = 0;
    }
    this.galleryService.ratingRange.update(prev => ({...prev, from: value}));
  }

  setRatingTo(value: number) {
    if (value > 5) {
      value = 5;
    }
    if (value < 0) {
      value = 0;
    }
    this.galleryService.ratingRange.update(prev => ({...prev, to: value}));
  }

  setAddedFrom(value: number) {
    if (value > MAX_ADDED_COUNT) {
      value = MAX_ADDED_COUNT;
    }
    if (value < 0) {
      value = 0;
    }
    this.galleryService.addedCountRange.update(prev => ({...prev, from: value}));
  }

  setAddedTo(value: number) {
    if (value > MAX_ADDED_COUNT) {
      value = MAX_ADDED_COUNT;
    }
    if (value < 0) {
      value = 0;
    }
    this.galleryService.addedCountRange.update(prev => ({...prev, to: value}));
  }

  setPublishedFrom(date: Date | null) {
    this.galleryService.publishedAtRange.update(prev => ({...prev, from: date}));
  }

  setPublishedTo(date: Date | null) {
    this.galleryService.publishedAtRange.update(prev => ({...prev, to: date}));
  }

  setSortBy(selection: SortByOption) {
    this.galleryService.sortBy.set(selection);
  }

  //test func for changing locale
  changeLocale() {
    if (this.lang.currentLocale === 'en-UK') {
      this.lang.setLocale('ru-RU')
    } else {
      this.lang.setLocale('en-UK')
    }

  }
}

const MAX_ADDED_COUNT = 100000;
