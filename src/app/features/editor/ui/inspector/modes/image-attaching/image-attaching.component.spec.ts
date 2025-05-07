import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAttachingComponent } from './image-attaching.component';

describe('ImageAttachingComponent', () => {
  let component: ImageAttachingComponent;
  let fixture: ComponentFixture<ImageAttachingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageAttachingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageAttachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
