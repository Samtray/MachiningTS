import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarProveedorComponent } from './agregar-proveedor.component';

describe('AgregarProveedorComponent', () => {
  let component: AgregarProveedorComponent;
  let fixture: ComponentFixture<AgregarProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarProveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
