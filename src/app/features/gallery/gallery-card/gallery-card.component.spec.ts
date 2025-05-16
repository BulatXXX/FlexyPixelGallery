import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryCardComponent } from './gallery-card.component';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

describe('GalleryCardComponent', () => {
  let component: GalleryCardComponent;
  let fixture: ComponentFixture<GalleryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GalleryCardComponent,
        ReactiveFormsModule
      ],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryCardComponent);
    component = fixture.componentInstance;

    // сначала задаём обязательный Input
    component.item = {
      publicId:        "",
      name:            "",
      description:     "",
      previewImageUrl: "https://example.com/preview.png",
      author: {
        publicId:    "",
        username:    "",
        avatarUrl:   "",
        displayName: "",
      },
      tags:            ["",""],
      createdAt:       "",
      publishedAt:     "",
      averageRating:   "",
      addedCount:      "",
    } as any;

    // только после этого рендерим
    fixture.detectChanges();
  });


  it('should create', () => {
    const fixture = TestBed.createComponent(GalleryCardComponent);
    const component = fixture.componentInstance;


    component.item = {
      publicId:        "",
      name:            "",
      description:     "",
      previewImageUrl: "",
      author: {
        publicId:    "",
        username:    "",
        avatarUrl:   "",
        displayName: "",
      },
      tags:            ["",""],
      createdAt:       "",
      publishedAt:     "",
      averageRating:   "",
      addedCount:      "",

    } as any;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
