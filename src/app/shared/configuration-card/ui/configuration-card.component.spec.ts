import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationCardComponent } from './configuration-card.component';

describe('ConfigurationCardComponent', () => {
  let component: ConfigurationCardComponent;
  let fixture: ComponentFixture<ConfigurationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
