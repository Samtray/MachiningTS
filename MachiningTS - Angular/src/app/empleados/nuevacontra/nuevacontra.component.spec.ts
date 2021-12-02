import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevacontraComponent } from './nuevacontra.component';

describe('NuevacontraComponent', () => {
  let component: NuevacontraComponent;
  let fixture: ComponentFixture<NuevacontraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevacontraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevacontraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
