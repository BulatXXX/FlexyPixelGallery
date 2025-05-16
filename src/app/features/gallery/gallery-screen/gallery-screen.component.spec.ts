import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryScreenComponent } from './gallery-screen.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GalleryScreenComponent', () => {
  let component: GalleryScreenComponent;
  let fixture: ComponentFixture<GalleryScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryScreenComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(GalleryScreenComponent, {
        set: {
          template: `<h1>Gallery works</h1>`
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(GalleryScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
