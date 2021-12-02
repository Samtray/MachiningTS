import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposGruposComponent } from './tipos-grupos.component';

describe('TiposGruposComponent', () => {
  let component: TiposGruposComponent;
  let fixture: ComponentFixture<TiposGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposGruposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
