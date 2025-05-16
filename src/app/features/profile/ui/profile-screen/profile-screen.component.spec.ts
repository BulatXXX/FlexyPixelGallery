import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileScreenComponent } from './profile-screen.component';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';

describe('ProfileScreenComponent', () => {
  let component: ProfileScreenComponent;
  let fixture: ComponentFixture<ProfileScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileScreenComponent],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
