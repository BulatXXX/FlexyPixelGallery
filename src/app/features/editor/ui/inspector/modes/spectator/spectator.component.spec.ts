import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpectatorComponent } from './spectator.component';

describe('SpectatorComponent', () => {
  let component: SpectatorComponent;
  let fixture: ComponentFixture<SpectatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpectatorComponent]
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
