import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeScreenComponent } from './home-screen.component';
import {provideTranslateService} from '@ngx-translate/core';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {of} from 'rxjs';

describe('HomeScreenComponent', () => {
  let component: HomeScreenComponent;
  let fixture: ComponentFixture<HomeScreenComponent>;

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
      imports: [HomeScreenComponent],
      providers: [provideTranslateService(),{ provide: ActivatedRoute, useValue: activatedRouteStub }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
