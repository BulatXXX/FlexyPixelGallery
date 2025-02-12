import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorScreenComponent } from './editor-screen.component';

describe('EditorScreenComponent', () => {
  let component: EditorScreenComponent;
  let fixture: ComponentFixture<EditorScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorScreenComponent]
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
