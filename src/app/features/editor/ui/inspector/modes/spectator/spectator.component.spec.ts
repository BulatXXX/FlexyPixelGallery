import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpectatorComponent } from './spectator.component';
import {provideHttpClient} from '@angular/common/http';

describe('SpectatorComponent', () => {
  let component: SpectatorComponent;
  let fixture: ComponentFixture<SpectatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpectatorComponent],
      providers: [
        provideHttpClient(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpectatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
