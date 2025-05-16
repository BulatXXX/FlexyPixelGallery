import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpScreenComponent } from './sign-up-screen.component';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {AuthRepository} from '../../AuthRepository';

describe('SignUpScreenComponent', () => {
  let component: SignUpScreenComponent;
  let fixture: ComponentFixture<SignUpScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpScreenComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthRepository, useValue: {} },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
