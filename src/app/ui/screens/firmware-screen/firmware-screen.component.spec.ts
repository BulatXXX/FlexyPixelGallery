import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmwareScreenComponent } from './firmware-screen.component';

describe('FirmwareScreenComponent', () => {
  let component: FirmwareScreenComponent;
  let fixture: ComponentFixture<FirmwareScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmwareScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirmwareScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
