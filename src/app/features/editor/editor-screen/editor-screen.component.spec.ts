import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorScreenComponent } from './editor-screen.component';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';

describe('EditorScreenComponent', () => {
  let component: EditorScreenComponent;
  let fixture: ComponentFixture<EditorScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorScreenComponent],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
