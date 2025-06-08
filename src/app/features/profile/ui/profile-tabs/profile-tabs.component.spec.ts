import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTabsComponent } from './profile-tabs.component';
import {provideTranslateService} from '@ngx-translate/core';
import {ActivatedRoute, convertToParamMap, provideRouter} from '@angular/router';
import {of} from 'rxjs';

describe('ProfileTabsComponent', () => {
  let component: ProfileTabsComponent;
  let fixture: ComponentFixture<ProfileTabsComponent>;
  const activatedRouteStub = {
    snapshot: {
      paramMap: convertToParamMap({ id: '123' })
    },
    paramMap: of(convertToParamMap({ id: '123' })),
    queryParams: of({}),
    data: of({})
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileTabsComponent],
      providers: [provideTranslateService(),{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
