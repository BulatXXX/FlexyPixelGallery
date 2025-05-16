import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarHeaderComponent } from './toolbar-header.component';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';

describe('ToolbarHeaderComponent', () => {
  let component: ToolbarHeaderComponent;
  let fixture: ComponentFixture<ToolbarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarHeaderComponent],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
