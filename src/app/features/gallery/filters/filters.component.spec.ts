import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersComponent } from './filters.component';
import { GalleryService } from '../gallery.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {NO_ERRORS_SCHEMA, signal} from '@angular/core';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  beforeEach(async () => {
    const galleryServiceStub: Partial<GalleryService> = {
      ratingRange:      signal({ from: null, to: null }),
      addedCountRange:  signal({ from: null, to: null }),
      publishedAtRange: signal({ from: null, to: null }),
      sortBy:           signal({ ADDED_COUNT: { order: 'ASC' } } as any),
    };

    await TestBed.configureTestingModule({
      imports: [FiltersComponent],
      providers: [
        { provide: GalleryService, useValue: galleryServiceStub },
        provideHttpClient(),
        provideRouter([]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(FiltersComponent, {
        set: { template: '<div>filters works</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
