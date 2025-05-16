import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecoveryScreenComponent } from './password-recovery-screen.component';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';

describe('PasswordRecoveryScreenComponent', () => {
  let component: PasswordRecoveryScreenComponent;
  let fixture: ComponentFixture<PasswordRecoveryScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecoveryScreenComponent],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordRecoveryScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
