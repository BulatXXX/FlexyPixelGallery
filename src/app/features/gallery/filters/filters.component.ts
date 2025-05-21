import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCard, MatCardModule} from '@angular/material/card';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from '@angular/material/datepicker';
import {MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';  //
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {NgForOf} from '@angular/common';
import {MatMenu} from '@angular/material/menu';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {GalleryService} from '../gallery.service';
import {range} from 'rxjs';
import {MatSlider, MatSliderModule, MatSliderRangeThumb} from '@angular/material/slider';


export interface Filters {
  publishedAtRange: { from: string; to: string } | null;
  ratingRange: { from: number | null; to: number | null } | null;
  addedCountRange: { from: number | null; to: number | null } | null;
  sortBy: Record<string, { order: 'ASC' | 'DESC' }> | null;
  tagFilterIds: string[] | null;
  tagMatchMode: 'ANY' | 'ALL' | null;
}

export enum Sorts {
  PUBLISHED_AT = "PUBLISHEDAT",
  AVERAGE_RATING = "AVERAGERATING",
  ADDED_COUNT = "ADDEDCOUNT"
}

@Component({
  selector: 'app-filters',
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatDateRangeInput,
    MatDatepickerToggle,
    MatDateRangePicker,
    MatOption,
    MatSelect,
    MatIcon,
    FormsModule,

    MatSlider,
    MatSliderRangeThumb,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './filters.component.html',
  standalone: true,
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  selectedSort: Sorts = Sorts.PUBLISHED_AT;

  constructor(protected galleryService: GalleryService,) {
  }

  ngOnInit(): void {

  }


  apply(): void {

  }

  reset(): void {

  }

  protected readonly Sorts = Sorts;

  // filters.component.ts (продолжение)

  setRatingFrom(value: number) {
    this.galleryService.ratingRange.update(prev => ({ ...prev, from: value }));
  }

  setRatingTo(value: number) {
    this.galleryService.ratingRange.update(prev => ({ ...prev, to: value }));
  }

  setAddedFrom(value: number) {
    this.galleryService.addedCountRange.update(prev => ({ ...prev, from: value }));
  }

  setAddedTo(value: number) {
    this.galleryService.addedCountRange.update(prev => ({ ...prev, to: value }));
  }

  setPublishedFrom(date: Date | null) {
    this.galleryService.publishedAtRange.update(prev => ({ ...prev, from: date }));
  }

  setPublishedTo(date: Date | null) {
    this.galleryService.publishedAtRange.update(prev => ({ ...prev, to: date }));
  }


  setSortBy(event: string) {

  }

  protected readonly Date = Date;
}
