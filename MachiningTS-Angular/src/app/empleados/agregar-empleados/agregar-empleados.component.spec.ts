import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEmpleadosComponent } from './agregar-empleados.component';

describe('AgregarEmpleadosComponent', () => {
  let component: AgregarEmpleadosComponent;
  let fixture: ComponentFixture<AgregarEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarEmpleadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
