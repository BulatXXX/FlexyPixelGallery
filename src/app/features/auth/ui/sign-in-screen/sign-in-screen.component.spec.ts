import {TestBed } from '@angular/core/testing';

import { SignInScreenComponent } from './sign-in-screen.component';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {AuthRepository} from '../../AuthRepository';

describe('SignInScreenComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthRepository, useValue: {} },
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SignInScreenComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
