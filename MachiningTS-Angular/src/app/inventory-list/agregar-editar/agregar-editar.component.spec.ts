import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEditarComponent } from './agregar-editar.component';

describe('AgregarEditarComponent', () => {
  let component: AgregarEditarComponent;
  let fixture: ComponentFixture<AgregarEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
