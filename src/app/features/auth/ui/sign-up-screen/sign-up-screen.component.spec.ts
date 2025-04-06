import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpScreenComponent } from './sign-up-screen.component';

describe('SignUpScreenComponent', () => {
  let component: SignUpScreenComponent;
  let fixture: ComponentFixture<SignUpScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpScreenComponent]
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
