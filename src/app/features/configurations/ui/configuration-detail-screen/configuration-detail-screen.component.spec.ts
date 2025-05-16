import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationDetailScreenComponent } from './configuration-detail-screen.component';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';

describe('ConfigurationDetailScreenComponent', () => {
  let component: ConfigurationDetailScreenComponent;
  let fixture: ComponentFixture<ConfigurationDetailScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationDetailScreenComponent],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationDetailScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
