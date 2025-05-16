import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileInfoComponent } from './profile-info.component';
import { UserService } from '../../UserService';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProfileInfoComponent', () => {
  let component: ProfileInfoComponent;
  let fixture: ComponentFixture<ProfileInfoComponent>;
  let userServiceMock: Partial<UserService>;

  beforeEach(async () => {
    userServiceMock = {
      updateAvatar: (_file: File) => of(''),  // теперь Observable<string>
      loadUserProfile: () => {}
    };

    await TestBed.configureTestingModule({
      imports: [ProfileInfoComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInfoComponent);
    component = fixture.componentInstance;

    component.user = {
      publicId: 'u1',
      username: 'john_doe',
      displayName: 'John Doe',
      avatarUrl: 'https://example.com/avatar.png'
    };

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
