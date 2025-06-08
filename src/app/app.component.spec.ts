import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {provideRouter} from '@angular/router';
import {provideTranslateService} from '@ngx-translate/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers:[
        provideRouter([]),
        provideTranslateService()
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'FlexyPixelGallery' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('FlexyPixelGallery');
  });

});
