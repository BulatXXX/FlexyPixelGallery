import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInScreenComponent } from './sign-in-screen.component';

describe('SignInScreenComponent', () => {
  let component: SignInScreenComponent;
  let fixture: ComponentFixture<SignInScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
