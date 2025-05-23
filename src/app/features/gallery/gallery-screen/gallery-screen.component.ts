import {Component} from '@angular/core';

import {MatFormField, MatInput} from '@angular/material/input';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {GalleryCardComponent} from '../gallery-card/gallery-card.component';
import {MatCard, MatCardModule} from '@angular/material/card';
import {GalleryConfigurationRepository} from '../gallery-configuration.repository';
import {GalleryService} from '../gallery.service';
import {FiltersComponent} from '../filters/filters.component';


@Component({
  selector: 'app-gallery-screen',
  imports: [
    MatFormField,
    MatIcon,
    MatInput,
    NgForOf,
    NgIf,
    GalleryCardComponent,
    MatCardModule,
    FiltersComponent
  ],
  templateUrl: './gallery-screen.component.html',
  standalone: true,
  styleUrl: './gallery-screen.component.css'
})
export class GalleryScreenComponent {


  constructor(protected svc: GalleryService) {
  }
}
