import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecoveryScreenComponent } from './password-recovery-screen.component';

describe('PasswordRecoveryScreenComponent', () => {
  let component: PasswordRecoveryScreenComponent;
  let fixture: ComponentFixture<PasswordRecoveryScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecoveryScreenComponent]
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
